'use client';

import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const session = useSession();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) {
        router.push('/upload');
      } else {
        router.push('/auth');
      }
    }, 1000); // small delay for user feedback

    return () => clearTimeout(timer);
  }, [session, router]);

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h2 className="header">Redirecting...</h2>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px' }}>
        Please wait while we determine your access.
      </p>
    </div>
  );
}
