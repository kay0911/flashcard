import { create } from 'zustand';
import type { Card } from '../types';

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  
  initializeQuiz: (cards: Card[]) => void;
  answerQuestion: (isCorrect: boolean) => void;
  resetQuiz: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentIndex: 0,
  score: 0,
  
  initializeQuiz: (cards) => {
    if (!cards || cards.length === 0) return;
    
    let generatedQuestions: QuizQuestion[] = [];
    
    // Front -> Back (Guess definition)
    cards.forEach(card => {
      let distractors = cards.filter(c => c.id !== card.id).map(c => c.back);
      distractors = shuffleArray(distractors).slice(0, 3); // Lấy tối đa 3 distractor 
      let options = shuffleArray([card.back, ...distractors]);
      generatedQuestions.push({
        questionText: card.front,
        options,
        correctAnswer: card.back
      });
    });
    
    // Back -> Front (Guess word)
    cards.forEach(card => {
      let distractors = cards.filter(c => c.id !== card.id).map(c => c.front);
      distractors = shuffleArray(distractors).slice(0, 3);
      let options = shuffleArray([card.front, ...distractors]);
      generatedQuestions.push({
        questionText: card.back,
        options,
        correctAnswer: card.front
      });
    });
    
    // Đảo mảng cho xịn
    generatedQuestions = shuffleArray(generatedQuestions);
    set({ questions: generatedQuestions, currentIndex: 0, score: 0 });
  },
  
  answerQuestion: (isCorrect) => set((state) => ({
    score: isCorrect ? state.score + 1 : state.score,
    currentIndex: state.currentIndex + 1
  })),
  
  resetQuiz: () => set({ questions: [], currentIndex: 0, score: 0 })
}));
