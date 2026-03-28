'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617]">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <div className="absolute inset-0 blur-xl bg-cyan-500/20 rounded-full animate-pulse" />
      </div>
      <p className="mt-4 text-cyan-100 font-medium tracking-widest uppercase animate-pulse">Initializing LifeLink AI...</p>
    </div>
  );
}
