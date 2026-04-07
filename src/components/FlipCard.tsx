import React from 'react';
import { Volume2 } from 'lucide-react';

interface FlipCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onClick: () => void;
}

export const FlipCard = ({ front, back, isFlipped, onClick }: FlipCardProps) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(front);
      utterance.lang = 'en-US'; 
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ phát âm.");
    }
  };

  return (
    <div 
      className="w-full max-w-md aspect-[3/4] md:aspect-video cursor-pointer perspective-1000"
      style={{ perspective: '1000px' }}
      onClick={onClick}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 w-full h-full rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <button
            onClick={handleSpeak}
            className="absolute top-6 right-6 p-3 rounded-full text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            title="Nghe phát âm"
          >
            <Volume2 className="w-6 h-6" />
          </button>

          <span className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 text-center">
            {front}
          </span>
          <span className="absolute bottom-6 text-sm text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-medium">
            Chạm để lật
          </span>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-2xl md:text-3xl font-medium text-indigo-900 dark:text-indigo-100">
            {back}
          </span>
        </div>
      </div>
    </div>
  );
};
