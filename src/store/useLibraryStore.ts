import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { DeckWithCards, Card } from '../types';

interface LibraryState {
  decks: DeckWithCards[];
  loading: boolean;
  fetchLibrary: (userId: string) => Promise<void>;
  saveDeck: (userId: string, title: string, cards: Card[]) => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  decks: [],
  loading: false,

  fetchLibrary: async (userId: string) => {
    set({ loading: true });
    try {
      const { data: decksData, error: decksError } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (decksError) throw decksError;

      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*');

      if (cardsError) throw cardsError;

      const mappedDecks = decksData.map((deck) => ({
        ...deck,
        cards: cardsData.filter((card) => card.deck_id === deck.id),
      }));

      set({ decks: mappedDecks });
    } catch (error) {
      console.error('Error fetching library:', error);
    } finally {
      set({ loading: false });
    }
  },

  saveDeck: async (userId: string, title: string, cards: Card[]) => {
    try {
        const { data: deck, error: deckError } = await supabase
          .from('decks')
          .insert({ user_id: userId, title })
          .select()
          .single();
        
        if (deckError) throw deckError;
        
        const cardsToInsert = cards.map((c) => ({
          deck_id: deck.id,
          front: c.front,
          back: c.back,
        }));
        
        const { error: cardsError } = await supabase
          .from('cards')
          .insert(cardsToInsert);
          
        if (cardsError) throw cardsError;

    } catch (error) {
        console.error('Error saving deck:', error);
        throw error;
    }
  },
  
  deleteDeck: async (deckId: string) => {
    try {
      const { error } = await supabase.from('decks').delete().eq('id', deckId);
      if (error) throw error;
      set((state) => ({
        decks: state.decks.filter(d => d.id !== deckId)
      }));
    } catch (err) {
      console.error('Error deleting deck:', err);
    }
  }
}));
