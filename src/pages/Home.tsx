import { useFlashcardStore } from '../store/useFlashcardStore';
import { InputSection } from '../components/InputSection';
import { StudySection } from '../components/StudySection';
import { QuizSection } from '../components/QuizSection';
import { QuizResult } from '../components/QuizResult';

export const Home = () => {
  const step = useFlashcardStore((state) => state.step);

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      {(step === 'input' || step === 'processing') && <InputSection />}
      {step === 'study' && <StudySection />}
      {step === 'quiz' && <QuizSection />}
      {step === 'quiz_result' && <QuizResult />}
    </div>
  );
};
