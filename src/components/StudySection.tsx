import { useState } from 'react';
import { useFlashcardStore } from '../store/useFlashcardStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { useAuthStore } from '../store/useAuthStore';
import { useQuizStore } from '../store/useQuizStore';
import { FlipCard } from './FlipCard';
import { DeckControls } from './DeckControls';
import { Save, Loader2, Check, Target, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudySection = () => {
  const { cards, currentIndex, flipCard, isSaved, setIsSaved, setStep } = useFlashcardStore();
  const { initializeQuiz } = useQuizStore();
  const { saveDeck } = useLibraryStore();
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  if (!cards.length) return null;
  const currentCard = cards[currentIndex];

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const title = cards[0]?.front || 'Untitled Deck';
    try {
      await saveDeck(user.id, `Từ vựng từ: ${title}`, cards);
      setIsSaved(true);
    } catch (err) {
      alert("Lỗi khi lưu bài!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center py-4 px-4 flex-col min-h-[75vh]">
      <div className="w-full max-w-md flex justify-start mb-6">
        <button
          onClick={() => isSaved ? navigate('/library') : setStep('input')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors bg-white dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700/50"
        >
          <ArrowLeft className="w-4 h-4" />
          {isSaved ? "Thư viện bộ thẻ" : "Tạo bộ thẻ mới"}
        </button>
      </div>

      <FlipCard
        front={currentCard.front}
        back={currentCard.back}
        isFlipped={currentCard.isFlipped}
        onClick={() => flipCard(currentCard.id)}
      />
      <DeckControls />
      
      <div className="mt-12 flex flex-col md:flex-row items-center gap-4">
        <button
          onClick={() => {
            initializeQuiz(cards);
            setStep('quiz');
          }}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95 w-full md:w-auto"
        >
          <Target className="w-5 h-5" />
          Kiểm tra trắc nghiệm
        </button>

        {!isSaved ? (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 text-white rounded-xl font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 w-full md:w-auto"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Đang lưu..." : "Lưu vào Thư Viện"}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 px-6 py-3 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl font-medium w-full md:w-auto">
            <Check className="w-5 h-5" /> Đã nằm trong Thư Viện
          </div>
        )}
      </div>
    </div>
  );
};
