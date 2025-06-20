'use client';
import { useEffect, useState } from 'react';

type LogEntry = {
  id: number;
  username: string;
  prediction: number;
  image_url?: string;
  created_at: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetch('/api/logs')
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setLogs(data);
        console.log(data)
      } else {
        console.error('Expected an array but got:', data);
        setLogs([]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching logs:', err);
      setLoading(false);
    });
    
}, []);


  if (loading) return <p>Loading logs...</p>;

  return (
    <div className="container">
      <h2 className="main-title">Prediction Logs</h2>
      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="log-entry">
            <p className="log-username">User: {log.username}</p>
            <p>Prediction: {log.prediction}</p>
            <p>Date: {new Date(log.created_at).toLocaleString()}</p>
            {log.image_url && (
              <img
                src={log.image_url}
                alt="Prediction Artifact"
                className="image-preview"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
