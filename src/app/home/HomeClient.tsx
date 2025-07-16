'use client';

import { ClientInfoForm } from '@/components/client-info-form';
import { MealSelection } from '@/components/meal-selection';
import { QuoteSummary } from '@/components/quote-summary';
import { useQuote } from '@/hooks/use-quote';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeClient({ username }: { username: string }) {
  const quoteManager = useQuote();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.replace('/');
    } catch (err) {
      setLoggingOut(false);
      alert('Logout failed. Please try again.');
    }
  };

  if (quoteManager.loading) {
    return (
      <div className="flex min-h-screen w-full flex-col font-body bg-[#f5f5dc]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <h1 className="font-headline text-2xl font-semibold text-primary">
            قاعة السلطان
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
    <div className="flex min-h-screen w-full flex-col font-body bg-[#f5f5dc]">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <h1 className="font-headline text-2xl font-semibold text-primary">
          قاعة السلطان
        </h1>
        <div className="flex-grow"></div>
        <>
          <span className="me-4 text-green-700 font-bold">Welcome{username ? `, ${username}` : '!'}</span>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              color: '#fff',
              background: loggingOut ? '#e5e5e5' : '#b91c1c',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: 16,
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              textDecoration: 'none',
              marginLeft: 8,
            }}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </>
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