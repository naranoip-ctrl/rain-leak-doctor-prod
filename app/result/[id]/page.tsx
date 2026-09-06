'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DiagnosisResult, type DiagnosisSession } from '@/components/DiagnosisResult';

export default function ResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const [session, setSession] = useState<DiagnosisSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let shouldPoll = false;
    setLoading(true);
    setSession(null);
    setError('');
    async function fetchSession() {
      try {
        if (!id) throw new Error('診断が指定されていません。');
        const response = await fetch('/api/diagnosis/result/' + id, { signal: controller.signal });
        const json = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok || !json.data) throw new Error(json.error || '結果を取得できませんでした。');
        setSession(json.data);
        setError('');
        shouldPoll = json.data.status === 'processing';
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : '結果を取得できませんでした。');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
      if (shouldPoll && !controller.signal.aborted) timer = setTimeout(fetchSession, 5000);
    }
    fetchSession();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [id, retry]);

  return <DiagnosisResult session={session?.id === id ? session : null} loading={loading} error={error} onRetry={() => setRetry(value => value + 1)} />;
}
