'use client';

import { useEffect, useState } from 'react';
import type { Quote } from '@/lib/types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale/he';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import QuotePrintView from '@/components/QuotePrintView';

export default function PrintPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedQuotesRaw = localStorage.getItem('quotecraft-pro-quotes');
      if (savedQuotesRaw) {
        const savedQuotes = JSON.parse(savedQuotesRaw);
        if (savedQuotes.length > 0) {
          const currentQuote = savedQuotes[0];
           setQuote({
            ...currentQuote,
            createdAt: new Date(currentQuote.createdAt),
            clientInfo: {
                ...currentQuote.clientInfo,
                eventDate: currentQuote.clientInfo.eventDate ? new Date(currentQuote.clientInfo.eventDate) : undefined,
            },
           });
        }
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">No Quote Found</h1>
          <p className="text-gray-500">Please create a quote first.</p>
        </div>
      </div>
    );
  }

  return <QuotePrintView quote={quote} />;
}
