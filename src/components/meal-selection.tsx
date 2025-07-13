'use client';

import { useState } from 'react';
import { mealItems, categories } from '@/lib/data';
import type { QuoteManager, MealItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';

function MealCard({ meal, onAdd }: { meal: MealItem; onAdd: (meal: MealItem, comment?: string) => void }) {
  const [comment, setComment] = useState('');

  const handleAdd = () => {
    onAdd(meal, comment);
    setComment(''); // Reset comment after adding
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={meal.image}
            alt={meal.name}
            fill
            className="object-cover"
            data-ai-hint={meal.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg">{meal.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
        <div className="mt-3 space-y-2">
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
        <Button size="sm" onClick={handleAdd} className={meal.price === 0 ? "w-full" : ""}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MealSelection({ quoteManager }: { quoteManager: QuoteManager }) {
  const { addMeal } = quoteManager;

  const handleAddMeal = (meal: MealItem, comment?: string) => {
    // Create a meal item with the comment
    const mealWithComment = { ...meal, comment };
    addMeal(mealWithComment);
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
                  <MealCard key={item.id} meal={item} onAdd={handleAddMeal} />
                ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
