'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-6 text-center">
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-red-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">System Interruption</h2>
      <p className="text-red-200 opacity-80 mb-8 max-w-md mx-auto">
        A critical error occurred while processing the bridge. The system is still online and ready for a reset.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95"
      >
        <RefreshCcw size={20} />
        <span>Restart Bridge</span>
      </button>
    </div>
  );
}
