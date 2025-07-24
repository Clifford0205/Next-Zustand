'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useTodoStore } from '@/lib/todoStore';

export function AddTodo() {
  const [text, setText] = useState<string>('');
  const { addTodo } = useTodoStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          placeholder="新增待辦事項..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!text.trim()}>
          新增
        </Button>
      </form>
    </Card>
  );
}