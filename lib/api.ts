import { User } from '@/types/UserTypes';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 60 } // Next.js ISR: 1 分鐘快取
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
}

export const USER_QUERY_KEY = ['users'] as const;