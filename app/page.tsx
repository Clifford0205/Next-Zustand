import { TodoList } from '@/components/TodoList';
import { MonsterList } from '@/components/MonsterList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchMonsters } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function Home() {
  const queryClient = new QueryClient();

  // 預取用戶資料
  await queryClient.prefetchQuery({
    queryKey: ['monsters'],
    queryFn: fetchMonsters,
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 標題區域 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Zustand 狀態管理教學
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            透過 Todo List 範例學習 Zustand - 一個輕量且強大的 React 狀態管理庫
          </p>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <MonsterList />
        </HydrationBoundary>

        {/* 教學說明區域 */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 什麼是 Zustand？</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Zustand 是一個小巧、快速且可擴展的狀態管理解決方案。
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 簡單的 API，無需樣板代碼</li>
                <li>• 內建 TypeScript 支援</li>
                <li>• 支援中間件 (如持久化)</li>
                <li>• 無需 Provider 包裝</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🚀 核心概念</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                這個 Todo List 示範了 Zustand 的核心功能：
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 建立 Store 和 Actions</li>
                <li>• 狀態持久化 (localStorage)</li>
                <li>• 響應式更新</li>
                <li>• TypeScript 類型安全</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Todo List 主要內容 */}
        <TodoList />

        {/* 程式碼說明區域 */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Store 結構說明</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`// lib/todoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (text) => set((state) => ({ 
        todos: [newTodo, ...state.todos] 
      })),
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo => 
          todo.id === id 
            ? { ...todo, completed: !todo.completed } 
            : todo
        )
      })),
      // ... 更多 actions
    }),
    { name: 'todo-storage' } // localStorage 鍵名
  )
);`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
