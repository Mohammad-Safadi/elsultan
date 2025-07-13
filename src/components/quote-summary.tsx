'use client';

import type { QuoteManager } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MinusCircle, PlusCircle, Trash2, Printer, Mail, Download, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export function QuoteSummary({ quoteManager }: { quoteManager: QuoteManager }) {
  const { currentQuote, updateMealQuantity, removeMeal, updateMealComment } = quoteManager;

  const handlePrint = () => {
    window.open('/print', '_blank');
  };
  
  const handleShareEmail = () => {
    if (!currentQuote) return;
    const subject = `Quote for ${currentQuote.clientInfo.name}`;
    let body = `Hello ${currentQuote.clientInfo.name},\n\nHere is your quote for the event on ${currentQuote.clientInfo.eventDate ? format(currentQuote.clientInfo.eventDate, 'PPP') : 'N/A'}.\n\n`;
    body += `Guest Count: ${currentQuote.clientInfo.guestCount}\n\n`;
    
    // Group items by category
    const categories = Array.from(new Set(currentQuote.items.map(item => item.category)));
    categories.forEach(category => {
      const categoryItems = currentQuote.items.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        body += `${category}:\n`;
        categoryItems.forEach(item => {
          body += `- ${item.name} (x${item.quantity})\n`;
          if (item.comment) {
            body += `  Note: ${item.comment}\n`;
          }
        });
        body += '\n';
      }
    });
    
    body += `\nThank you,\nElsultan Halls`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShareWhatsApp = () => {
    if (!currentQuote) return;
    let text = `*Quote for ${currentQuote.clientInfo.name}*\n\n`;
    
    // Group items by category
    const categories = Array.from(new Set(currentQuote.items.map(item => item.category)));
    categories.forEach(category => {
      const categoryItems = currentQuote.items.filter(item => item.category === category);
      if (categoryItems.length > 0) {
        text += `*${category}:*\n`;
        categoryItems.forEach(item => {
          text += `- ${item.name} (x${item.quantity})\n`;
          if (item.comment) {
            text += `  Note: ${item.comment}\n`;
          }
        });
        text += '\n';
      }
    });
    
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
                <div key={item.uid} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateMealQuantity(item.uid, item.quantity - 1)}><MinusCircle className="h-4 w-4" /></Button>
                      <span>{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateMealQuantity(item.uid, item.quantity + 1)}><PlusCircle className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeMeal(item.uid)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`comment-${item.uid}`} className="text-sm font-medium">Add Note:</Label>
                    <Input
                      id={`comment-${item.uid}`}
                      placeholder="Add special instructions or notes..."
                      value={item.comment || ''}
                      onChange={(e) => updateMealComment(item.uid, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardContent className="p-6 space-y-2">
        
      </CardContent>
      <CardFooter className="flex-col !p-6 space-y-4">
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
