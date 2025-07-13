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

function MealCard({ meal, onAdd, onRemove, isSelected, selectedQuantity }: { 
  meal: MealItem; 
  onAdd: (meal: MealItem, comment?: string) => void;
  onRemove: (mealId: number) => void;
  isSelected: boolean;
  selectedQuantity: number;
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
      isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''
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
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRemove}
                className="flex-1"
              >
                <MinusCircle className="mr-2 h-4 w-4" />
                Remove
              </Button>
              <Button 
                size="sm" 
                onClick={handleAdd} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add More ({selectedQuantity})
              </Button>
            </>
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
    // Create a meal item with the comment
    const mealWithComment = { ...meal, comment };
    addMeal(mealWithComment);
  };

  const handleRemoveMeal = (mealId: number) => {
    // Find all items with this meal ID and remove them
    const itemsToRemove = currentQuote?.items.filter(item => item.id === mealId) || [];
    itemsToRemove.forEach(item => {
      removeMeal(item.uid);
    });
  };

  // Helper function to check if an item is selected
  const isItemSelected = (mealId: number) => {
    return currentQuote?.items.some(item => item.id === mealId) || false;
  };

  // Helper function to get the quantity of a selected item
  const getSelectedQuantity = (mealId: number) => {
    const items = currentQuote?.items.filter(item => item.id === mealId) || [];
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {categories.map(category => (
          <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
        ))}
      </TabsList>
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
                    selectedQuantity={getSelectedQuantity(item.id)}
                  />
                ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
