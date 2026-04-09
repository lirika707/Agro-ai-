import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while loading the data. Please try again later.', 
  onRetry,
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center space-y-6 bg-red-50 rounded-[40px] border border-red-100 ${className}`}>
      <div className="p-4 bg-red-100 rounded-full text-red-600">
        <AlertCircle className="w-12 h-12" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold text-red-900">{title}</h3>
        <p className="text-red-700 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20 group"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Try Again
        </button>
      )}
    </div>
  );
}
