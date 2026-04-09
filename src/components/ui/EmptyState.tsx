import React from 'react';
import { Ghost } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ 
  title = 'No items found', 
  description = 'Try adjusting your filters or search to find what you are looking for.', 
  icon = <Ghost className="w-16 h-16 text-gray-300" />,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-16 text-center space-y-6 bg-white rounded-[40px] border border-dashed border-gray-200 ${className}`}>
      <div className="p-6 bg-gray-50 rounded-full">
        {icon}
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
      {action && (
        <div className="pt-2">
          {action}
        </div>
      )}
    </div>
  );
}
