import React from 'react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = 'info', children, className = '' }: AlertProps) {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-cyan-50 border-cyan-200 text-primary',
  };

  return (
    <div
      className={`border px-4 py-3 rounded-lg ${styles[type]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
