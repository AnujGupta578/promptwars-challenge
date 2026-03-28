'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Info, Activity } from 'lucide-react';
import { ActionPlan } from '@/lib/agents/orchestrator';

interface ActionCardsProps {
  plan: ActionPlan | null;
}

export default function ActionCards({ plan }: ActionCardsProps) {
  if (!plan) return null;

  const priorityColor = {
    CRITICAL: 'from-red-600 to-rose-700 border-red-500/50 text-red-50',
    HIGH: 'from-orange-500 to-amber-600 border-orange-500/50 text-orange-50',
    MEDIUM: 'from-yellow-400 to-yellow-600 border-yellow-500/50 text-yellow-50',
    LOW: 'from-emerald-500 to-teal-600 border-emerald-500/50 text-emerald-50',
  }[plan.priority] || 'from-blue-500 to-cyan-600 border-blue-500/50 text-blue-50';

  const PriorityIcon = {
    CRITICAL: Activity,
    HIGH: AlertTriangle,
    MEDIUM: Info,
    LOW: ShieldCheck,
  }[plan.priority] || ShieldCheck;

  return (
    <div className={`glass-panel p-6 mt-8 max-w-3xl w-full mx-auto relative overflow-hidden transition-all duration-500 ease-out transform scale-100 opacity-100 bg-gradient-to-br ${priorityColor} shadow-2xl`}>
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <PriorityIcon size={120} />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="bg-black/20 p-2 rounded-full backdrop-blur-sm">
          <PriorityIcon className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{plan.category}</h2>
          <span className="text-sm font-medium opacity-90 tracking-widest uppercase bg-black/20 px-2 py-1 rounded">
            {plan.priority} PRIORITY
          </span>
        </div>
      </div>

      <div className="mb-6 bg-black/20 p-4 rounded-lg relative z-10 border border-white/10 shadow-inner">
        <p className="text-lg font-medium leading-relaxed">
          {plan.summary}
        </p>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-4 border-b border-white/20 pb-2">Action Plan</h3>
        <ul className="space-y-3">
          {plan.steps.map((step, idx) => (
            <li key={idx} className="flex gap-3 items-start bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center font-bold text-sm shadow-inner border border-white/10">
                {idx + 1}
              </span>
              <span className="pt-1 leading-relaxed text-blue-50 drop-shadow-sm">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.requiresVerification && (
        <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg flex items-start gap-3 relative z-10 backdrop-blur-md">
          <AlertTriangle className="text-red-200 mt-1 flex-shrink-0" />
          <p className="text-sm text-red-100">
            <strong>Verification Required:</strong> This action plan involves high-risk instructions. Please verify with local authorities or experts immediately.
          </p>
        </div>
      )}
    </div>
  );
}
