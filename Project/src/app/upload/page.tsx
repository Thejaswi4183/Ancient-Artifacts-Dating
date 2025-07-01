'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UploadForm from '@/components/UploadForm';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  // 👇 Fix: Handle OAuth redirect and restore session
  useEffect(() => {
    const handleOAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        router.replace('/upload'); // strip ?code=... from URL
      }
    };

    handleOAuth();
  }, [supabase, router]);

  if (!session?.user) {
    return (
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="header">Please Sign In</h2>
        <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '18px', marginTop: '10px' }}>
          You must be logged in to use the artifact age predictor.
        </p>
        <a
          href="/auth"
          style={{
            marginTop: '20px',
            display: 'inline-block',
            background: '#4a3b2a',
            color: '#fff8dc',
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'Cinzel, serif',
            fontWeight: 'bold',
          }}
        >
          Go to Login
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UploadForm />
    </motion.div>
  );
}
