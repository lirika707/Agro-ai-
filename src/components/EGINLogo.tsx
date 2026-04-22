import React from 'react';

export default function EGINLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] flex items-center justify-center font-bold text-white text-lg">E</div>
      <span className="text-2xl font-black text-[#2D6A4F] tracking-tight">EGIN</span>
    </div>
  );
}
