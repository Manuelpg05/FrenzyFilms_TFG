'use client';

import { Suspense } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p>Cargando admin...</p>}>
      {children}
    </Suspense>
  );
}
