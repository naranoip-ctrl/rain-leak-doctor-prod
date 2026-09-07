'use client';

import { usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/AdminLayout';
import { ToastProvider } from '@/components/AdminUI';
import styles from '@/components/AdminTheme.module.css';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ログインページの場合はAdminLayout（AuthGuard含む）をスキップ
  if (pathname === '/admin/login') {
    return (
      <div className={styles.theme}><ToastProvider>
        {children}
      </ToastProvider></div>
    );
  }

  return (
    <div className={styles.theme}><ToastProvider>
      <AdminLayout>{children}</AdminLayout>
    </ToastProvider></div>
  );
}
