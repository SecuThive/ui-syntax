'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocsPage() {
  const router = useRouter();

  useEffect(() => {
    // 첫 번째 컴포넌트로 리다이렉트
    router.push('/docs/button/primary');
  }, [router]);

  return null;
}
