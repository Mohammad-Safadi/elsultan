import type { Quote } from '@/lib/types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale/he';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

interface QuotePrintViewProps {
  quote: Quote;
  hidePrintButton?: boolean;
}

const categoryGroups = {
  'سلطات': ['سلطات السلطان', 'سلطات خاصة'],
  'وجبات أولية': ['وجبات أوّليّة', 'وجبات أوّلية خاصة'],
  'وجبات رئيسية': ['وجبات رئيسية', 'وجبات رئيسية أكسترا'],
  'وجبات خاصة أكسترا': ['وجبات خاصة أكسترا'],
  'مشروبات': ['مشروبات روحية', 'مشروبات ساخنة', 'مشروبات خفيفة']
};

export default function QuotePrintView({ quote, hidePrintButton }: QuotePrintViewProps) {
  const printContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = printContentRef.current;
    if (!element) return;
  
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
  
    const margin = 20;
    const usableWidth = pageWidth - margin * 2;
  
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = usableWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
    let heightLeft = imgHeight;
    let position = margin;
  
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - margin * 2);
  
    while (heightLeft > 0) {
      position -= (pageHeight - margin * 2);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);
    }
  
    // Generate file name based on client name (fallback to "quote" if not available)
    const clientName = quote.clientInfo.name?.trim().replace(/\s+/g, '_') || 'quote';
    pdf.save(`${clientName}.pdf`);
  };
  
  

  return (
    <div className="min-h-screen bg-white p-8 print:p-0 relative print-container">
      {/* Go Back Button - Top Left, hidden when printing */}
      {!hidePrintButton && (
        <a
          href="/home"
          className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded bg-primary text-white font-semibold shadow hover:bg-primary/90 transition print:hidden"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft className="h-5 w-5" />
          חזרה
        </a>
      )}
      <div ref={printContentRef} className="max-w-4xl mx-auto bg-white print:max-w-none">
        {/* Header */}
        <header className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
            <div>
                <h1 className="font-headline text-5xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Amiri', serif" }}>قاعة السلطان</h1>
            </div>
            <div className="text-right">
                <p className="text-gray-500 mt-1">{format(new Date(), 'PPPP', { locale: he })}</p>
            </div>
        </header>

        {/* Client Information */}
        <div className="flex flex-row justify-between items-start gap-8 py-4 border-b-2 border-gray-200 client-info-section">
            <div>
                <h3 className="font-headline text-lg font-semibold text-gray-700 mb-2">הזמנה ל:</h3>
                <p className="mt-1 text-lg font-medium">{quote.clientInfo.name || 'N/A'}</p>
                <p className="text-gray-600">{quote.clientInfo.phoneNumber || 'N/A'}</p>
            </div>
            <div className="text-right">
                 <h3 className="font-headline text-lg font-semibold text-gray-700 mb-2">פרטי אירוע:</h3>
                 <p className="mt-1">תאריך: {quote.clientInfo.eventDate ? format(quote.clientInfo.eventDate, 'PPPP', { locale: he }) : 'N/A'}</p>
                 <p>عدد الضيوف: {quote.clientInfo.guestCount}</p>
            </div>
        </div>

        {/* Menu Items */}
        <div className="py-4 menu-items-section">
          {Object.entries(categoryGroups).map(([parentCategory, subCategories]) => {
            // For merged categories, combine items from all subcategories
            const mergedItems = quote.items.filter(item =>
              subCategories.includes(item.category)
            );
            if (mergedItems.length === 0) return null;
            return (
              <div key={parentCategory} className="mb-4 category-section" style={{ pageBreakInside: 'avoid', pageBreakBefore: 'auto' }}>
                <h3 className="font-headline text-2xl font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Amiri', serif", pageBreakAfter: 'avoid' }}>
                  {parentCategory}
                </h3>
                <table className="w-full border-collapse" style={{ direction: 'rtl', pageBreakInside: 'auto' }}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 font-headline font-semibold text-gray-600" style={{ padding: '8px 10px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb' }}>الصنف</th>
                      <th className="p-2 font-headline font-semibold text-gray-600" style={{ padding: '8px 10px', fontWeight: 'bold', borderBottom: '1px solid #e5e7eb' }}>الملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergedItems.map(item => (
                      <tr key={item.uid} className="border-b border-gray-100" style={{ pageBreakInside: 'avoid' }}>
                        <td className="p-2 font-medium" style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>{item.name}</td>
                        <td className="p-2 text-sm text-gray-600" style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6' }}>{item.comment || '-'}</td>
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
        <div className="w-full flex flex-row-reverse justify-end mt-6 mb-1" style={{ direction: 'rtl' }}>
          <div className="flex flex-row-reverse items-center gap-2" style={{ minWidth: 0 }}>
            <div className="border-b-2 border-gray-400 h-8" style={{ minWidth: 80, maxWidth: 200, width: 200 }}></div>
            <span className="font-headline text-lg font-semibold text-gray-700" style={{ minWidth: 60, textAlign: 'right', whiteSpace: 'nowrap' }}>מחיר:</span>
          </div>
        </div>
        {/* Signatures */}
        <footer className="pt-4 border-t-2 border-gray-200">
          <div className="flex flex-row gap-8 justify-between items-center mt-4">
            <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
              <span className="font-headline text-lg font-semibold text-gray-700 whitespace-nowrap">חתימת הלקוח:</span>
              <div className="border-b-2 border-gray-400 h-0.5 flex-1 min-w-[100px] max-w-[200px]"></div>
            </div>
            <div className="flex flex-row items-center gap-2 min-w-0 flex-1">
              <span className="font-headline text-lg font-semibold text-gray-700 whitespace-nowrap">חתימת מורשה:</span>
              <div className="border-b-2 border-gray-400 h-0.5 flex-1 min-w-[100px] max-w-[200px]"></div>
            </div>
          </div>
        </footer>
      </div>

      {/* Print/Save PDF Buttons - Bottom Left, Hidden when printing */}
      {!hidePrintButton && (
        <div className="fixed bottom-6 left-6 print:hidden z-50 flex flex-row gap-3">
          <Button onClick={() => window.print()} className="bg-primary hover:bg-primary/90 shadow-lg">
            <Printer className="mr-2 h-4 w-4" />
            Print Quote
          </Button>
          <Button onClick={handleDownloadPdf} className="bg-primary hover:bg-primary/90 shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Save PDF
          </Button>
        </div>
      )}
    </div>
  );
} 