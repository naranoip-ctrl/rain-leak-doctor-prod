'use client';

import React, { useState, createContext, useContext } from 'react';

/* ─── Badge ─── */
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

const badgeVariants = {
  default: 'bg-[#24483f] text-white',
  secondary: 'bg-slate-100 text-slate-700',
  outline: 'border border-slate-300 text-slate-700 bg-transparent',
  destructive: 'bg-red-500 text-white',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex max-w-full items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/* ─── Label ─── */
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={`block text-sm font-medium text-slate-700 ${className}`} {...props}>
      {children}
    </label>
  );
}

/* ─── Textarea ─── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  const generatedId = React.useId();
  const id = props.id || generatedId;
  return (
    <div className="w-full">
      {label && <Label htmlFor={id} className="mb-2">{label}</Label>}
      <textarea
        id={id}
        className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#24483f]/30 focus:border-[#24483f] resize-y ${className}`}
        {...props}
      />
    </div>
  );
}

/* ─── Select ─── */
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function Select({ value, onValueChange, children, id, className = '' }: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#24483f]/30 focus:border-[#24483f] text-sm ${className}`}
    >
      {children}
    </select>
  );
}

export function SelectOption({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

/* ─── Switch ─── */
interface SwitchProps {
  id?: string;
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ id, label, checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#24483f]/30"
    >
      <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#24483f]' : 'bg-slate-300'}`}>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      </span>
    </button>
  );
}

/* ─── Tabs ─── */
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType>({ activeTab: '', setActiveTab: () => {} });

export function Tabs({ defaultValue, children, className = '' }: { defaultValue: string; children: React.ReactNode; className?: string }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div role="group" aria-label="一覧の切り替え" className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-fit">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => setActiveTab(value)}
      className={`flex-1 sm:flex-none min-h-11 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive ? 'bg-white text-[#24483f] shadow-sm' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
}

/* ─── Toast (simple) ─── */
let toastCallback: ((msg: string, type: 'success' | 'error') => void) | null = null;

export function setToastCallback(cb: (msg: string, type: 'success' | 'error') => void) {
  toastCallback = cb;
}

export const toast = {
  success: (msg: string) => toastCallback?.(msg, 'success'),
  error: (msg: string) => toastCallback?.(msg, 'error'),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([]);

  React.useEffect(() => {
    setToastCallback((msg, type) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    });
    return () => { toastCallback = null; };
  }, []);

  return (
    <>
      {children}
      <div aria-live="polite" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-full sm:max-w-sm z-[100] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-fade-in-up ${
              t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
