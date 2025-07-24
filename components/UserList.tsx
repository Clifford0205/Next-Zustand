import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/UserTypes';
import { UserCard } from './UserCard';

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 3600 } // 快取 1 小時
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
}

function LoadingSkeleton() {
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

async function UserListContent() {
  try {
    const users = await fetchUsers();
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👥 使用者列表
            <span className="text-sm font-normal text-muted-foreground">
              (透過 SSR 從 JSONPlaceholder API 取得)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-2">💡 SSR (Server-Side Rendering) 功能展示：</p>
            <ul className="space-y-1">
              <li>• 伺服器端預先渲染</li>
              <li>• 更好的 SEO 支援</li>
              <li>• 更快的首次內容呈現 (FCP)</li>
              <li>• 內建快取策略 (ISR)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
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
}

export function UserList() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <UserListContent />
    </Suspense>
  );
}