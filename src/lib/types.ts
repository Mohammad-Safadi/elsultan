export interface MealItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  dataAiHint: string;
}

export interface SelectedMeal extends MealItem {
  uid: string;
  comment?: string;
}

export interface ClientInfo {
  name: string;
  phoneNumber: string;
  eventDate: Date | undefined;
  guestCount: string;
}

export interface Quote {
  id: string;
  clientInfo: ClientInfo;
  items: SelectedMeal[];
  createdAt: Date;
}

export type QuoteManager = ReturnType<typeof import('@/hooks/use-quote').useQuote>;
