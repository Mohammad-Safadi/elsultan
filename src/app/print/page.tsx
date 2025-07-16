'use client';

import { useEffect, useState } from 'react';
import type { Quote } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

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

  // Define merged category groupings for print
  const categoryGroups = {
    'سلطات': ['سلطات السلطان', 'سلطات خاصة'],
    'وجبات أولية': ['وجبات أوّليّة', 'وجبات أوّلية خاصة'],
    'وجبات رئيسية': ['وجبات رئيسية', 'وجبات رئيسية أكسترا'],
    'وجبات خاصة أكسترا': ['وجبات خاصة أكسترا'],
    'مشروبات': ['مشروبات روحية', 'مشروبات ساخنة', 'مشروبات خفيفة']
  };

  return (
    <div className="min-h-screen bg-white p-8 print:p-0 relative print-container">
      <div className="max-w-4xl mx-auto bg-white print:max-w-none">
        {/* Header */}
        <header className="flex justify-between items-start pb-8 border-b-2 border-gray-200">
            <div>
                <h1 className="font-headline text-5xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Amiri', serif" }}>قاعة السلطان</h1>
            </div>
            <div className="text-right">
                <p className="text-gray-500 mt-1">Date: {format(new Date(), 'dd/MM/yyyy')}</p>
            </div>
        </header>

        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b-2 border-gray-200 client-info-section">
            <div>
                <h3 className="font-headline text-lg font-semibold text-gray-700">הזמנה ל:</h3>
                <p className="mt-2 text-lg font-medium">{quote.clientInfo.name || 'N/A'}</p>
                <p className="text-gray-600">{quote.clientInfo.phoneNumber || 'N/A'}</p>
            </div>
            <div className="text-right">
                 <h3 className="font-headline text-lg font-semibold text-gray-700">פרטי אירוע:</h3>
                 <p className="mt-2">תאריך: {quote.clientInfo.eventDate ? format(quote.clientInfo.eventDate, 'dd/MM/yyyy') : 'N/A'}</p>
                 <p>عدد الضيوف: {quote.clientInfo.guestCount}</p>
            </div>
        </div>

        {/* Menu Items */}
        <div className="py-8 menu-items-section">
          <h2 className="font-headline text-3xl font-bold text-gray-800 mb-8" style={{ fontFamily: "'Amiri', serif" }}>Menu Items</h2>

          {Object.entries(categoryGroups).map(([parentCategory, subCategories]) => {
            // For merged categories, combine items from all subcategories
            const mergedItems = quote.items.filter(item =>
              subCategories.includes(item.category)
            );
            if (mergedItems.length === 0) return null;
            return (
              <div key={parentCategory} className="mb-8 category-section" style={{ pageBreakInside: 'avoid', pageBreakBefore: 'auto' }}>
                <h3 className="font-headline text-2xl font-semibold text-gray-700 mb-4" style={{ fontFamily: "'Amiri', serif", pageBreakAfter: 'avoid' }}>
                  {parentCategory}
                </h3>
                <table className="w-full border-collapse" style={{ direction: 'rtl', pageBreakInside: 'auto' }}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 font-headline font-semibold text-gray-600" style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb' }}>الصنف</th>
                      <th className="p-4 font-headline font-semibold text-gray-600" style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb' }}>الملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergedItems.map(item => (
                      <tr key={item.uid} className="border-b border-gray-100" style={{ pageBreakInside: 'avoid' }}>
                        <td className="p-4 font-medium" style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{item.name}</td>
                        <td className="p-4 text-sm text-gray-600" style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>{item.comment || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Footer - Price and Signatures */}
        {/* Price Row */}
        <div className="w-full flex flex-row-reverse justify-end mt-12 mb-2" style={{ direction: 'rtl' }}>
          <div className="flex flex-row-reverse items-center gap-2" style={{ minWidth: 0 }}>
            <div className="border-b-2 border-gray-400 h-8" style={{ minWidth: 80, maxWidth: 200, width: 200 }}></div>
            <span className="font-headline text-lg font-semibold text-gray-700" style={{ minWidth: 60, textAlign: 'right', whiteSpace: 'nowrap' }}>מחיר:</span>
          </div>
        </div>
        {/* Signatures */}
        <footer className="pt-8 border-t-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-headline text-lg font-semibold text-gray-700 mb-4">חתימת הלקוח:</h3>
              <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold text-gray-700 mb-4">חתימה מורשית:</h3>
              <div className="border-b-2 border-gray-400 h-12 mb-2"></div>
            </div>
          </div>
        </footer>
      </div>

      {/* Print Button - Bottom Left, Hidden when printing */}
      <div className="fixed bottom-6 left-6 print:hidden z-50">
        <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90 shadow-lg">
          <Printer className="mr-2 h-4 w-4" />
          Print Quote
        </Button>
      </div>
    </div>
  );
}
