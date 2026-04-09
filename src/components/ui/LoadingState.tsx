import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 space-y-4 ${className}`}>
      <Loader2 className="w-10 h-10 text-[#2D6A4F] animate-spin" />
      <p className="text-gray-500 font-medium animate-pulse">{message}</p>
    </div>
  );
}
