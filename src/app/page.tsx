'use client';

import { ClientInfoForm } from '@/components/client-info-form';
import { MealSelection } from '@/components/meal-selection';
import { QuoteSummary } from '@/components/quote-summary';
import { useQuote } from '@/hooks/use-quote';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const quoteManager = useQuote();

  if (quoteManager.loading) {
    return (
       <div className="flex min-h-screen w-full flex-col font-body">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <h1 className="font-headline text-2xl font-semibold text-primary">
            Elsultan Halls
          </h1>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-8 md:p-6">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <aside className="w-full md:w-96 lg:w-[400px]">
            <Skeleton className="h-full w-full" />
          </aside>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col font-body">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <h1 className="font-headline text-2xl font-semibold text-primary">
          Elsultan Halls
        </h1>
        <div className="flex-grow"></div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:flex-row md:gap-8 md:p-6">
        <div className="flex-1">
          <ClientInfoForm quoteManager={quoteManager} />
          <MealSelection quoteManager={quoteManager} />
        </div>
        <aside className="w-full md:w-96 lg:w-[400px]">
          <div className="sticky top-20">
            <QuoteSummary quoteManager={quoteManager} />
          </div>
        </aside>
      </main>
    </div>
  );
}
