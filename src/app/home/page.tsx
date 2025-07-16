import HomeClient from './HomeClient';
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const username = (await cookies()).get('username')?.value || '';
  return <HomeClient username={username} />;
} 