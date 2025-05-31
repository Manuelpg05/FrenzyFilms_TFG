'use client';

import { Suspense } from 'react';

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p>Cargando perfil...</p>}>
      {children}
    </Suspense>
  );
}
