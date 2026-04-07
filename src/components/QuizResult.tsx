import { RotateCcw, ArrowLeft } from 'lucide-react';
import { useQuizStore } from '../store/useQuizStore';
import { useFlashcardStore } from '../store/useFlashcardStore';

export const QuizResult = () => {
  const { score, questions, resetQuiz, initializeQuiz } = useQuizStore();
  const { setStep, cards } = useFlashcardStore();
  
  const percentage = Math.round((score / questions.length) * 100);
  
  const getMessage = () => {
    if (percentage === 100) return "Hoàn hảo! Trí nhớ tuyệt đỉnh 🏆";
    if (percentage >= 80) return "Tuyệt vời! Bạn nhớ gần hết rồi 🌟";
    if (percentage >= 50) return "Khá tốt! Hãy cố gắng thêm một chút nhé 👍";
    return "Đừng nản chí! Học lại lần nữa sẽ nhớ lâu hơn 💪";
  };

  const getBorderColor = () => {
    if (percentage >= 80) return 'border-green-500 text-green-500';
    if (percentage >= 50) return 'border-yellow-500 text-yellow-500';
    return 'border-red-500 text-red-500';
  }

  const handleRetry = () => {
    resetQuiz();
    initializeQuiz(cards);
    setStep('quiz');
  };

  const handleBackToStudy = () => {
    resetQuiz();
    setStep('study');
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-12 px-4 text-center min-h-[75vh]">
      <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full border-8 flex items-center justify-center mb-8 bg-white dark:bg-zinc-900 shadow-xl ${getBorderColor()}`}>
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-7xl font-black">{percentage}%</span>
          <span className="text-sm font-medium mt-1 text-zinc-500 dark:text-zinc-400">ĐỘ CHÍNH XÁC</span>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
        {getMessage()}
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg">
        Bạn đã trả lời đúng {score} trên tổng số {questions.length} câu hỏi.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={handleRetry}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 w-full sm:w-auto"
        >
          <RotateCcw className="w-5 h-5" /> Làm lại bài Test
        </button>
        <button
          onClick={handleBackToStudy}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl font-bold transition-all w-full sm:w-auto"
        >
          <ArrowLeft className="w-5 h-5" /> Trở lại Ôn tập
        </button>
      </div>
    </div>
  );
};
