import { useState, useEffect } from 'react';
import { useQuizStore } from '../store/useQuizStore';
import { useFlashcardStore } from '../store/useFlashcardStore';

export const QuizSection = () => {
  const { questions, currentIndex, answerQuestion } = useQuizStore();
  const { setStep } = useFlashcardStore();
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (questions.length > 0 && currentIndex >= questions.length) {
      setStep('quiz_result');
    }
  }, [currentIndex, questions.length, setStep]);

  if (!questions.length || currentIndex >= questions.length) return null;

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    
    setTimeout(() => {
      answerQuestion(isCorrect);
      setSelectedOption(null);
      setIsAnswered(false);
    }, 1500);
  };

  const getOptionStyle = (option: string) => {
    if (!isAnswered) return "bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700";
    
    if (option === currentQuestion.correctAnswer) {
      return "bg-green-500 text-white border-green-600 dark:border-green-500";
    }
    
    if (option === selectedOption && option !== currentQuestion.correctAnswer) {
      return "bg-red-500 text-white border-red-600 dark:border-red-500";
    }
    
    return "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-800 opacity-50";
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center py-10 px-4 min-h-[75vh]">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Kiểm tra trắc nghiệm</h2>
        <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium rounded-full text-sm">
          Câu {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-8 md:p-12 shadow-sm mb-8 flex items-center justify-center min-h-[200px]">
        <h3 className="text-3xl md:text-5xl font-bold text-center text-zinc-900 dark:text-white leading-tight">
          {currentQuestion.questionText}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={`w-full text-left p-6 rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${getOptionStyle(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
