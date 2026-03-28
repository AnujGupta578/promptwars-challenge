'use client';

import { useState } from 'react';
import InputHub from '@/components/ui/InputHub';
import ActionCards from '@/components/ui/ActionCards';
import { ActionPlan } from '@/lib/agents/orchestrator';
import { Activity } from 'lucide-react';

export default function Home() {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResolve = async (text: string, mediaType: 'none' | 'image' | 'audio', mediaBase64?: string) => {
    setIsLoading(true);
    setError(null);
    setActionPlan(null);

    try {
      const response = await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mediaType, mediaBase64 }),
      });

      if (!response.ok || !response.body) {
        const json = await response.json();
        throw new Error(json.message || 'Failed to process the request block.');
      }

      // 🏆 Project 100: Real-time Streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkText = decoder.decode(value, { stream: true });
          accumulatedText += chunkText;
        }
      }

      // Final processing once the stream ends
      const finalPlan = JSON.parse(accumulatedText);
      setActionPlan(finalPlan);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error(error);
      setError(error.message || 'An error occurred while communicating with the LifeLink AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Decorative background elements offset from radial gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-900 rounded-full mix-blend-screen filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-900 rounded-full mix-blend-screen filter blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center pt-8 text-center text-white">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-cyan-500/30 text-cyan-300 text-sm font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <Activity size={16} className="animate-pulse" />
          <span>LifeLink AI System Online</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Universal <span className="gradient-text drop-shadow-[0_0_20px_rgba(0,242,254,0.4)]">Bridge</span>
        </h1>
        
        <p className="text-lg md:text-xl font-light text-cyan-50 opacity-80 max-w-2xl text-center leading-relaxed">
          Converting unstructured, real-world data—audio, photos, medical histories—into verified, structured, life-saving action plans instantly.
        </p>

        <div className="w-full mt-10">
          <InputHub onSubmit={handleResolve} isLoading={isLoading} />
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {actionPlan && (
          <div className="w-full animate-fade-in-up">
            <ActionCards plan={actionPlan} />
          </div>
        )}

      </div>
    </main>
  );
}
