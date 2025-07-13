'use client';

import { useEffect, useState } from 'react';
import type { Quote } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const TAX_RATE = 0.08;

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

  const subtotal = quote.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="p-8 md:p-12 font-body bg-white text-black max-w-4xl mx-auto">
        <header className="flex justify-between items-start pb-8 border-b-2 border-gray-200">
            <div>
                <h1 className="font-headline text-5xl font-bold text-[#D4AF37]">QuoteCraft Pro</h1>
                <p className="text-gray-500 mt-2">Your Premier Catering Partner</p>
            </div>
            <div className="text-right">
                <h2 className="text-2xl font-headline font-semibold">Catering Quote</h2>
                <p className="text-gray-500 mt-1">Date: {format(new Date(), 'PPP')}</p>
                <p className="text-gray-500">Quote ID: {quote.id.split('-')[0]}</p>
            </div>
        </header>

        <section className="my-8 grid grid-cols-2 gap-8">
            <div>
                <h3 className="font-headline text-lg font-semibold text-gray-700">Bill To:</h3>
                <p className="mt-2 text-lg font-medium">{quote.clientInfo.name || 'N/A'}</p>
            </div>
            <div className="text-right">
                 <h3 className="font-headline text-lg font-semibold text-gray-700">Event Details:</h3>
                 <p className="mt-2">Date: {quote.clientInfo.eventDate ? format(quote.clientInfo.eventDate, 'PPP') : 'N/A'}</p>
                 <p>Guests: {quote.clientInfo.guestCount}</p>
            </div>
        </section>

        <section className="my-10">
            <table className="w-full text-left">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 font-headline font-semibold text-gray-600">Item</th>
                        <th className="p-4 font-headline font-semibold text-gray-600 text-center">Quantity</th>
                        <th className="p-4 font-headline font-semibold text-gray-600 text-right">Unit Price</th>
                        <th className="p-4 font-headline font-semibold text-gray-600 text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {quote.items.map(item => (
                        <tr key={item.uid} className="border-b border-gray-100">
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4 text-center">{item.quantity}</td>
                            <td className="p-4 text-right">${item.price.toFixed(2)}</td>
                            <td className="p-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>

        <section className="flex justify-end my-8">
            <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Tax ({(TAX_RATE * 100).toFixed(0)}%):</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 mt-4! flex justify-between">
                    <span className="font-headline text-xl font-bold">Total:</span>
                    <span className="font-bold text-xl text-[#D4AF37]">${total.toFixed(2)}</span>
                </div>
            </div>
        </section>
        
        <footer className="pt-8 border-t-2 border-gray-200 text-center text-gray-500 text-sm">
            <p>Thank you for considering QuoteCraft Pro for your event!</p>
            <p>This quote is valid for 30 days. Prices are subject to change.</p>
        </footer>
    </div>
  );
}
