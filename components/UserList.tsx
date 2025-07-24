'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/UserTypes';
import { UserCard } from './UserCard';

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>👥 使用者列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div 
                key={index} 
                className="h-96 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>👥 使用者列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive">載入使用者資料時發生錯誤</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : '未知錯誤'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          👥 使用者列表
          <span className="text-sm font-normal text-muted-foreground">
            (透過 React Query 從 JSONPlaceholder API 取得)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users?.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-2">💡 React Query 功能展示：</p>
          <ul className="space-y-1">
            <li>• 自動快取管理</li>
            <li>• 載入狀態處理</li>
            <li>• 錯誤處理機制</li>
            <li>• 背景重新整理</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}