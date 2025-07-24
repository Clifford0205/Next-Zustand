'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchMonsters } from '@/lib/api';
import { MonsterCard } from './MonsterCard';

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

export function MonsterList() {
  const {
    data: monsters,
    isLoading,
    error,
    isStale,
    isFetching,
  } = useQuery({
    queryKey: ['monsters'],
    queryFn: fetchMonsters,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
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
            (SSR + React Query 混合模式)
          </span>
          {isFetching && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              更新中...
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {monsters?.map(monster => (
            <MonsterCard key={monster.id} monster={monster} />
          ))}
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-2">
            💡 SSR + React Query 混合模式功能：
          </p>
          <ul className="space-y-1">
            <li>• ⚡ 伺服器端預取 - 更快的首次載入</li>
            <li>• 🔄 客戶端 hydration - 無縫接管</li>
            <li>• 📱 背景重新整理 - 資料保持最新</li>
            <li>• 🚀 最佳化快取策略 - 效能與體驗兼顧</li>
            <li>
              • 🎯 狀態：{isStale ? '資料過時' : '資料新鮮'} |{' '}
              {isFetching ? '正在更新' : '閒置中'}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
