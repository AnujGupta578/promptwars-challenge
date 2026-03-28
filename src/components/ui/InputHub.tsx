'use client';

import React, { useState, useRef } from 'react';
import { ImageIcon, Mic, Send, Loader2, X } from 'lucide-react';

interface InputHubProps {
  onSubmit: (text: string, mediaType: 'none' | 'image' | 'audio', base64?: string) => void;
  isLoading: boolean;
}

export default function InputHub({ onSubmit, isLoading }: InputHubProps) {
  const [text, setText] = useState('');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Only images are supported currently.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !mediaPreview) return;
    
    onSubmit(
      text.trim(), 
      mediaPreview ? 'image' : 'none', 
      mediaPreview || undefined
    );
    
    // We intentionally keep the text/preview until successful, but for UX:
    // setText('');
    // setMediaPreview(null);
  };

  return (
    <div className="glass-panel p-4 mt-8 max-w-3xl w-full mx-auto relative overflow-hidden transition-all">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
      
      {mediaPreview && (
        <div className="mb-4 relative rounded-md overflow-hidden bg-black/50 border border-white/10 p-2 inline-block">
          <img src={mediaPreview} alt="Preview" className="max-h-48 rounded object-contain" />
          <button 
            type="button" 
            onClick={() => setMediaPreview(null)}
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the situation, upload a photo, or paste messy data..."
          className="w-full bg-black/20 text-white placeholder-gray-400 border border-white/20 rounded-lg p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none shadow-inner"
          disabled={isLoading}
        />
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 transition-colors flex items-center gap-2"
              title="Upload Image"
              disabled={isLoading}
            >
              <ImageIcon size={20} />
              <span className="text-sm font-medium hidden sm:inline">Add Image</span>
            </button>
            <button
              type="button"
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 transition-colors flex items-center gap-2 cursor-not-allowed opacity-50"
              title="Voice Input (Coming Soon)"
              disabled
            >
              <Mic size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !mediaPreview)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-full font-semibold px-8 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            <span>{isLoading ? 'Processing...' : 'Analyze'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
