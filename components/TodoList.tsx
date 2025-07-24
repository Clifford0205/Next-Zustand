'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodoStore } from '@/lib/todoStore';
import { TodoItem } from './TodoItem';
import { AddTodo } from './AddTodo';

type FilterType = 'all' | 'active' | 'completed';

export function TodoList() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { todos, clearCompleted, getTodosCount } = useTodoStore();
  
  const counts = getTodosCount();
  
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Zustand Todo List 教學
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AddTodo />
          
          {/* 統計資訊 */}
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
            <span>總計: {counts.total}</span>
            <span>進行中: {counts.active}</span>
            <span>已完成: {counts.completed}</span>
          </div>
          
          {/* 篩選按鈕 */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              全部
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              進行中
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              已完成
            </Button>
            {counts.completed > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearCompleted}
              >
                清除已完成
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Todo 項目列表 */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            {filter === 'all' && '沒有待辦事項，新增一個開始吧！'}
            {filter === 'active' && '沒有進行中的待辦事項'}
            {filter === 'completed' && '沒有已完成的待辦事項'}
          </Card>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
}