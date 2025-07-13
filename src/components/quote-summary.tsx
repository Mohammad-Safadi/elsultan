'use client';

import type { QuoteManager } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Trash2, Printer, Mail, Download, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AiSuggestions } from './ai-suggestions';
import { format } from 'date-fns';

const TAX_RATE = 0.08; // 8%

export function QuoteSummary({ quoteManager }: { quoteManager: QuoteManager }) {
  const { currentQuote, updateMealQuantity, removeMeal, subtotal } = quoteManager;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.open('/print', '_blank');
  };
  
  const handleShareEmail = () => {
    if (!currentQuote) return;
    const subject = `Quote for ${currentQuote.clientInfo.name}`;
    let body = `Hello ${currentQuote.clientInfo.name},\n\nHere is your quote for the event on ${currentQuote.clientInfo.eventDate ? format(currentQuote.clientInfo.eventDate, 'PPP') : 'N/A'}.\n\n`;
    body += `Guest Count: ${currentQuote.clientInfo.guestCount}\n\n`;
    body += "Selected Items:\n";
    currentQuote.items.forEach(item => {
        body += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    body += `\nSubtotal: $${subtotal.toFixed(2)}`;
    body += `\nTax (8%): $${tax.toFixed(2)}`;
    body += `\nTotal: $${total.toFixed(2)}`;
    body += `\n\nThank you,\nQuoteCraft Pro`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareWhatsApp = () => {
    if (!currentQuote) return;
    let text = `*Quote for ${currentQuote.clientInfo.name}*\n\n`;
    text += "Items:\n";
    currentQuote.items.forEach(item => {
        text += `- ${item.name} (x${item.quantity})\n`;
    });
    text += `\n*Total: $${total.toFixed(2)}*`;
     window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">Current Quote</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[calc(100vh-24rem)]">
          <div className="p-6 space-y-4">
            {currentQuote?.items.length === 0 ? (
              <p className="text-center text-muted-foreground">Select items to build the quote.</p>
            ) : (
              currentQuote?.items.map(item => (
                <div key={item.uid} className="flex items-center">
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateMealQuantity(item.uid, item.quantity - 1)}><MinusCircle className="h-4 w-4" /></Button>
                    <span>{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateMealQuantity(item.uid, item.quantity + 1)}><PlusCircle className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeMeal(item.uid)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardContent className="p-6 space-y-2">
         <AiSuggestions quoteManager={quoteManager} />
      </CardContent>
      <CardFooter className="flex-col !p-6 space-y-4">
        <div className="w-full space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold text-primary">
            <span className="font-headline">Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
            <Button onClick={handlePrint} variant="outline"><Printer className="me-2 h-4 w-4" /> Print</Button>
            <Button onClick={handlePrint}><Download className="me-2 h-4 w-4" /> Download</Button>
            <Button onClick={handleShareEmail} variant="outline"><Mail className="me-2 h-4 w-4" /> Email</Button>
            <Button onClick={handleShareWhatsApp}><MessageCircle className="me-2 h-4 w-4" /> WhatsApp</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
