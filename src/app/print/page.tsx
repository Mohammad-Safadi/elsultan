'use client';

import { useEffect, useState } from 'react';
import type { Quote } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

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
            }
           });
        }
      }
    } catch (error) {
      console.error('Failed to load quote for printing:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && quote) {
      setTimeout(() => window.print(), 500);
    }
  }, [loading, quote]);

  if (loading) {
    return <div className="p-12"><Skeleton className="w-full h-[80vh]" /></div>;
  }

  if (!quote) {
    return <div className="p-12 text-center">Could not load quote data.</div>;
  }

  const categories = Array.from(new Set(quote.items.map(item => item.category)));

  return (
    <div className="p-8 md:p-12 font-body bg-white text-black max-w-4xl mx-auto min-h-screen" dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif" }}>
        <header className="flex justify-between items-start pb-8 border-b-2 border-gray-200">
            <div>
                <h1 className="font-headline text-5xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Amiri', serif" }}>Elsultan Halls</h1>
                <p className="text-gray-500 mt-2">Your Premier Catering Partner</p>
            </div>
            <div className="text-right">
                <h2 className="text-2xl font-headline font-semibold" style={{ fontFamily: "'Amiri', serif" }}>Catering Quote</h2>
                <p className="text-gray-500 mt-1">Date: {format(new Date(), 'PPP')}</p>
                <p className="text-gray-500">Quote ID: {quote.id.split('-')[0]}</p>
            </div>
        </header>

        <section className="my-8 grid grid-cols-2 gap-8">
            <div>
                <h3 className="font-headline text-lg font-semibold text-gray-700">הזמנה ל:</h3>
                <p className="mt-2 text-lg font-medium">{quote.clientInfo.name || 'N/A'}</p>
            </div>
            <div className="text-right">
                 <h3 className="font-headline text-lg font-semibold text-gray-700">פרטי אירוע:</h3>
                 <p className="mt-2">תאריך: {quote.clientInfo.eventDate ? format(quote.clientInfo.eventDate, 'PPP') : 'N/A'}</p>
                 <p>عدد الضيوف: {quote.clientInfo.guestCount}</p>
            </div>
        </section>

        <section className="my-10">
            {categories.map(category => {
                const categoryItems = quote.items.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                
                return (
                    <div key={category} className="category-section mb-8" style={{ pageBreakInside: 'avoid' }}>
                        <h3 className="font-headline text-xl font-semibold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2 text-right" style={{ fontSize: '18px', marginTop: '24px', fontFamily: "'Amiri', serif" }}>
                            {category}
                        </h3>
                        <table className="w-full text-right" dir="rtl" style={{ borderCollapse: 'collapse' }}>
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 font-headline font-semibold text-gray-600" style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb' }}>الملاحظات</th>
                                    <th className="p-4 font-headline font-semibold text-gray-600" style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb' }}>الصنف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryItems.map(item => (
                                    <tr key={item.uid} className="border-b border-gray-100">
                                        <td className="p-4 text-sm text-gray-600" style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{item.comment || '-'}</td>
                                        <td className="p-4 font-medium" style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{item.name}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                );
            })}
        </section>
        
        <footer className="pt-8 border-t-2 border-gray-200">
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="font-headline text-lg font-semibold text-gray-700 mb-4">חתימת הלקוח:</h3>
                    <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
                </div>
                <div>
                    <h3 className="font-headline text-lg font-semibold text-gray-700 mb-4">חתימה מורשית:</h3>
                    <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
                    <p className="text-sm text-gray-600 mt-2">Elsultan Halls</p>
                </div>
            </div>
        </footer>
    </div>
  );
}
