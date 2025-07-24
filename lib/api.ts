import { Monster } from '@/types/MonsterTypes';

export async function fetchMonsters(): Promise<Monster[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 60 }, // Next.js ISR: 1 分鐘快取
  });

  if (!response.ok) {
    throw new Error('Failed to fetch monsters');
  }

  return response.json();
}
