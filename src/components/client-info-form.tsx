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
import { he } from 'date-fns/locale/he';
import { useEffect } from 'react';

type FormData = {
  name: string;
  phoneNumber: string;
  guestCount: string;
  eventDate: Date | undefined;
};

export function ClientInfoForm({ quoteManager }: { quoteManager: QuoteManager }) {
  const { currentQuote, updateClientInfo } = quoteManager;

  const { control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      name: currentQuote?.clientInfo.name || '',
      phoneNumber: currentQuote?.clientInfo.phoneNumber || '',
      guestCount: currentQuote?.clientInfo.guestCount?.toString() || '',
      eventDate: currentQuote?.clientInfo.eventDate,
    },
  });

  useEffect(() => {
    if (currentQuote) {
      setValue('name', currentQuote.clientInfo.name);
      setValue('phoneNumber', currentQuote.clientInfo.phoneNumber);
      setValue('guestCount', currentQuote.clientInfo.guestCount?.toString() || '');
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
        <CardTitle className="font-headline text-xl text-primary"> פרטי אירוע</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="name" className='font-bold'>שם לקוח</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} placeholder="e.g., John & Jane Doe" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className='font-bold'>מספר נייד</Label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <Input id="phoneNumber" {...field} placeholder="050-1234567" />}
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
                  type="text"
                  {...field}
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
                      {field.value ? format(field.value, 'PPPP', { locale: he }) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={he}
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
