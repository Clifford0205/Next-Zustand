'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useTodoStore } from '@/lib/todoStore';
import { TodoItem as TodoItemType } from '@/types/TodoTypes';

interface TodoItemProps {
  todo: TodoItemType;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodoStore();

  return (
    <Card className="p-4 flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-3 flex-1">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => toggleTodo(todo.id)}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`flex-1 cursor-pointer text-sm ${
            todo.completed
              ? 'line-through text-muted-foreground'
              : 'text-foreground'
          }`}
        >
          {todo.text}
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">
          {todo.createdAt.toLocaleTimeString()}
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteTodo(todo.id)}
        >
          刪除
        </Button>
      </div>
    </Card>
  );
}