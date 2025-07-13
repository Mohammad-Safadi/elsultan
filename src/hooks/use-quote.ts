'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Quote, ClientInfo, MealItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'quotecraft-pro-quotes';

const createNewQuote = (): Quote => ({
  id: uuidv4(),
  clientInfo: {
    name: '',
    eventDate: undefined,
    guestCount: 1,
  },
  items: [],
  createdAt: new Date(),
});

export function useQuote() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedQuotesRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedQuotesRaw) {
        const savedQuotes = JSON.parse(savedQuotesRaw).map((q: Quote) => ({
          ...q,
          createdAt: new Date(q.createdAt),
          clientInfo: {
            ...q.clientInfo,
            eventDate: q.clientInfo.eventDate ? new Date(q.clientInfo.eventDate) : undefined,
          }
        }));
        if (savedQuotes.length > 0) {
          setQuotes(savedQuotes);
          setCurrentQuote(savedQuotes[0]);
        } else {
          const newQuote = createNewQuote();
          setQuotes([newQuote]);
          setCurrentQuote(newQuote);
        }
      } else {
        const newQuote = createNewQuote();
        setQuotes([newQuote]);
        setCurrentQuote(newQuote);
      }
    } catch (error) {
      console.error("Failed to parse quotes from localStorage", error);
      const newQuote = createNewQuote();
      setQuotes([newQuote]);
      setCurrentQuote(newQuote);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
    }
  }, [quotes, loading]);

  const updateCurrentQuote = useCallback((updatedQuote: Quote) => {
    setCurrentQuote(updatedQuote);
    setQuotes(prevQuotes => {
      const newQuotes = [...prevQuotes];
      const index = newQuotes.findIndex(q => q.id === updatedQuote.id);
      if (index !== -1) {
        newQuotes[index] = updatedQuote;
      } else {
        newQuotes.unshift(updatedQuote);
      }
      return newQuotes;
    });
  }, []);

  const updateClientInfo = useCallback((info: Partial<ClientInfo>) => {
    if (currentQuote) {
      const updatedQuote: Quote = {
        ...currentQuote,
        clientInfo: { ...currentQuote.clientInfo, ...info },
      };
      updateCurrentQuote(updatedQuote);
    }
  }, [currentQuote, updateCurrentQuote]);

  const addMeal = useCallback((meal: MealItem & { comment?: string }) => {
    if (currentQuote) {
      const existingItem = currentQuote.items.find(item => item.id === meal.id);
      if (existingItem) {
        // If item exists, just increase quantity by one
        const updatedItems = currentQuote.items.map(item =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCurrentQuote({ ...currentQuote, items: updatedItems });
      } else {
        // If item doesn't exist, add it
        const newItem = { ...meal, quantity: 1, uid: uuidv4() };
        updateCurrentQuote({ ...currentQuote, items: [...currentQuote.items, newItem] });
      }
    }
  }, [currentQuote, updateCurrentQuote]);

  const updateMealQuantity = useCallback((uid: string, quantity: number) => {
    if (currentQuote) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = currentQuote.items.filter(item => item.uid !== uid);
        updateCurrentQuote({ ...currentQuote, items: updatedItems });
      } else {
        const updatedItems = currentQuote.items.map(item =>
          item.uid === uid ? { ...item, quantity } : item
        );
        updateCurrentQuote({ ...currentQuote, items: updatedItems });
      }
    }
  }, [currentQuote, updateCurrentQuote]);

  const removeMeal = useCallback((uid: string) => {
    if (currentQuote) {
      const updatedItems = currentQuote.items.filter(item => item.uid !== uid);
      updateCurrentQuote({ ...currentQuote, items: updatedItems });
    }
  }, [currentQuote, updateCurrentQuote]);

  const updateMealComment = useCallback((uid: string, comment: string) => {
    if (currentQuote) {
      const updatedItems = currentQuote.items.map(item =>
        item.uid === uid ? { ...item, comment } : item
      );
      updateCurrentQuote({ ...currentQuote, items: updatedItems });
    }
  }, [currentQuote, updateCurrentQuote]);

  return {
    loading,
    currentQuote,
    updateClientInfo,
    addMeal,
    updateMealQuantity,
    removeMeal,
    updateMealComment,
  };
}
