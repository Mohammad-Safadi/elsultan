'use client';

import type { QuoteManager } from '@/lib/types';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';

type FormData = {
  name: string;
  guestCount: number;
  eventDate: Date | undefined;
};

export function ClientInfoForm({ quoteManager }: { quoteManager: QuoteManager }) {
  const { currentQuote, updateClientInfo } = quoteManager;

  const { control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      name: currentQuote?.clientInfo.name || '',
      guestCount: currentQuote?.clientInfo.guestCount || 1,
      eventDate: currentQuote?.clientInfo.eventDate,
    },
  });

  useEffect(() => {
    if (currentQuote) {
      setValue('name', currentQuote.clientInfo.name);
      setValue('guestCount', currentQuote.clientInfo.guestCount);
      setValue('eventDate', currentQuote.clientInfo.eventDate);
    }
  }, [currentQuote, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if(name){
         updateClientInfo({ [name]: value[name] });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateClientInfo]);


  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">Client & פרטי אירוע</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="name" className='font-bold'>שם לקוח</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} placeholder="e.g., John & Jane Doe" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestCount" className='font-bold'>عدد الضيوف</Label>
            <Controller
              name="guestCount"
              control={control}
              render={({ field }) => (
                <Input
                  id="guestCount"
                  type="number"
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}
                  min="1"
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate" className='font-bold'>תאריך</Label>
            <Controller
              name="eventDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
