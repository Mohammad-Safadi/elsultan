'use client';

import { useState } from 'react';
import { mealItems, categories } from '@/lib/data';
import type { QuoteManager, MealItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Check, MinusCircle } from 'lucide-react';

function MealCard({ meal, onAdd, onRemove, isSelected }: { 
  meal: MealItem; 
  onAdd: (meal: MealItem, comment?: string) => void;
  onRemove: (mealId: number) => void;
  isSelected: boolean;
}) {
  const [comment, setComment] = useState('');

  const handleAdd = () => {
    onAdd(meal, comment);
    setComment(''); // Reset comment after adding
  };

  const handleRemove = () => {
    onRemove(meal.id);
  };

  return (
    <Card className={`flex flex-col overflow-hidden transition-all hover:shadow-xl relative ${
      isSelected ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''
    }`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="font-headline text-lg">{meal.name}</CardTitle>
          {isSelected && (
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="space-y-2">
          <Label htmlFor={`comment-${meal.id}`} className="text-sm font-medium">Add Note:</Label>
          <Input
            id={`comment-${meal.id}`}
            placeholder="Special instructions..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {meal.price > 0 && (
        <p className="text-lg font-semibold text-primary">
          ${meal.price.toFixed(2)}
        </p>
        )}
        <div className="flex gap-2 w-full">
          {isSelected ? (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRemove}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
              <Check className="mr-2 h-4 w-4" />
                Remove
              </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={handleAdd} 
              className="w-full"
            >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add
        </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export function MealSelection({ quoteManager }: { quoteManager: QuoteManager }) {
  const { addMeal, removeMeal, currentQuote } = quoteManager;

  const handleAddMeal = (meal: MealItem, comment?: string) => {
    // Prevent adding the same meal more than once (by id)
    if (currentQuote?.items.some(item => item.id === meal.id)) return;
    const mealWithComment = { ...meal, comment };
    addMeal(mealWithComment);
  };

  const handleRemoveMeal = (mealId: number) => {
    // Remove the item with this meal ID (only one instance)
    const itemToRemove = currentQuote?.items.find(item => item.id === mealId);
    if (itemToRemove) {
      removeMeal(itemToRemove.uid);
    }
  };

  // Helper function to check if an item is selected
  const isItemSelected = (mealId: number) => {
    return currentQuote?.items.some(item => item.id === mealId) || false;
  };

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 mb-6 p-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 min-h-[72px] bg-gray-50 p-2 rounded-lg gap-2">
        {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/20 data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-md data-[state=active]:border-2 data-[state=active]:border-primary/30 data-[state=active]:rounded-lg transition-all duration-300 ease-in-out text-base font-medium hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center py-3 px-2 text-center overflow-hidden whitespace-normal break-words leading-tight"
            >
              {category}
            </TabsTrigger>
        ))}
      </TabsList>
      </div>
      {categories.map(category => (
        <TabsContent key={category} value={category} className="mt-6">
          <div className="space-y-4">
            <h2 className="font-headline text-2xl font-semibold text-primary border-b-2 border-primary/20 pb-2">
              {category}
            </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mealItems
              .filter(item => item.category === category)
              .map(item => (
                  <MealCard 
                    key={item.id} 
                    meal={item} 
                    onAdd={handleAddMeal}
                    onRemove={handleRemoveMeal}
                    isSelected={isItemSelected(item.id)}
                  />
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
