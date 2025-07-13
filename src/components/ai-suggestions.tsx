'use client';

import { useState } from 'react';
import type { QuoteManager } from '@/lib/types';
import { Button } from './ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { suggestPackages } from '@/ai/flows/suggest-packages';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

export function AiSuggestions({ quoteManager }: { quoteManager: QuoteManager }) {
  const { getQuoteForAI, currentQuote } = quoteManager;
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    const mealSelections = getQuoteForAI();
    if (!mealSelections) {
      toast({
        title: 'Add some meals first!',
        description: 'Please select at least one meal to get AI suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSuggestions([]);
    try {
      const result = await suggestPackages({ mealSelections });
      if (result.suggestedPackages) {
        setSuggestions(result.suggestedPackages.split(',').map(s => s.trim()));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'AI Suggestion Failed',
        description: 'Could not get suggestions at this time. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const hasItems = (currentQuote?.items.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleGetSuggestions} 
        disabled={loading || !hasItems} 
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Get AI Package Suggestions
      </Button>
      {suggestions.length > 0 && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle className="font-headline">Suggested Packages</AlertTitle>
          <AlertDescription>
            <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map((pkg, index) => (
                    <Badge key={index} variant="secondary">{pkg}</Badge>
                ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
