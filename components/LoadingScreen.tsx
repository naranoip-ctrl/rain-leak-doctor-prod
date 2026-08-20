import { Spinner } from './Spinner';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = '読み込み中...' }: LoadingScreenProps) {
  return (
    <div className="diagnosis-refresh min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-600 font-bold">{message}</p>
      </div>
    </div>
  );
}
