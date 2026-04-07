export interface Card {
  id: string;
  front: string;
  back: string;
  isFlipped: boolean;
}

export type AppStep = 'input' | 'processing' | 'study' | 'quiz' | 'quiz_result';

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface DeckWithCards extends Deck {
  cards: Card[];
}
