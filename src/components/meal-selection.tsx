'use client';

import { mealItems, categories } from '@/lib/data';
import type { QuoteManager, MealItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';

function MealCard({ meal, onAdd }: { meal: MealItem; onAdd: (meal: MealItem) => void }) {
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
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">
          ${meal.price.toFixed(2)}
        </p>
        <Button size="sm" onClick={() => onAdd(meal)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}

export function MealSelection({ quoteManager }: { quoteManager: QuoteManager }) {
  const { addMeal } = quoteManager;

  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        {categories.map(category => (
          <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
        ))}
      </TabsList>
      {categories.map(category => (
        <TabsContent key={category} value={category}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mealItems
              .filter(item => item.category === category)
              .map(item => (
                <MealCard key={item.id} meal={item} onAdd={addMeal} />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
