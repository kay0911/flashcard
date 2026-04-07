import { create } from 'zustand';
import type { Card, AppStep } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface FlashcardState {
  step: AppStep;
  text: string;
  cards: Card[];
  currentIndex: number;
  isSaved: boolean;
  
  setText: (text: string) => void;
  generateFlashcards: () => Promise<void>;
  nextCard: () => void;
  prevCard: () => void;
  flipCard: (id: string) => void;
  setManualCards: (cards: { front: string; back: string }[]) => void;
  setIsSaved: (val: boolean) => void;
  setStep: (step: AppStep) => void;
  restartDeck: () => void;
  resetApp: () => void;
}

const extractVocabularyWithGemini = async (text: string): Promise<Card[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not defined in .env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Sử dụng model Gemini 3.1 Flash Lite Preview theo yêu cầu
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

  const prompt = `
Bạn là một chuyên gia ngôn ngữ. Hãy đọc đoạn văn bản dưới đây, trích xuất ra những từ vựng quan trọng nhất (khoảng 5-10 từ) và dịch nghĩa chúng sang tiếng Việt cho người học. 
Kết quả trả về PHẢI là một mảng JSON thuần túy (không có bọc block markdowns hay dòng text nào khác ngoài mảng).
Định dạng JSON yêu cầu:
[
  { "front": "từ khóa (ví dụ: contextual)", "back": "nghĩa của từ (ví dụ: theo ngữ cảnh)" }
]

Văn bản gốc: "${text}"
`;

  try {
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    // Clean markdown code blocks nếu có
    const cleanedText = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonParsed = JSON.parse(cleanedText);
    
    return jsonParsed.map((item: any, i: number) => ({
      id: `card-${Date.now()}-${i}`,
      front: item.front,
      back: item.back,
      isFlipped: false
    }));
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error('Lỗi khi phân tích từ vựng từ Gemini');
  }
};

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  step: 'input',
  text: '',
  cards: [],
  currentIndex: 0,
  isSaved: false,
  
  setStep: (step) => set({ step }),
  setText: (text) => set({ text }),
  setIsSaved: (val) => set({ isSaved: val }),
  
  generateFlashcards: async () => {
    const { text } = get();
    if (!text.trim()) return;
    
    set({ step: 'processing' });
    try {
      const generatedCards = await extractVocabularyWithGemini(text);
      if (generatedCards && generatedCards.length > 0) {
        set({ cards: generatedCards, step: 'study', currentIndex: 0, isSaved: false });
      } else {
        throw new Error("Không tìm thấy từ vựng nào");
      }
    } catch (error) {
      console.error(error);
      alert((error as Error).message || "Không thể trích xuất thẻ. Vui lòng thử lại!");
      set({ step: 'input' });
    }
  },
  
  nextCard: () => set((state) => ({
    currentIndex: Math.min(state.currentIndex + 1, state.cards.length - 1)
  })),
  
  prevCard: () => set((state) => ({
    currentIndex: Math.max(state.currentIndex - 1, 0)
  })),
  
  flipCard: (id) => set((state) => ({
    cards: state.cards.map(card => 
      card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
    )
  })),

  setManualCards: (items) => {
    const manualCards: Card[] = items.map((item, i) => ({
      id: `manual-${Date.now()}-${i}`,
      front: item.front,
      back: item.back,
      isFlipped: false
    }));
    set({ cards: manualCards, step: 'study', currentIndex: 0, isSaved: false });
  },
  
  restartDeck: () => set(state => ({
    currentIndex: 0,
    cards: state.cards.map(c => ({ ...c, isFlipped: false }))
  })),
  
  resetApp: () => set({ step: 'input', text: '', cards: [], currentIndex: 0, isSaved: false }),
}));
