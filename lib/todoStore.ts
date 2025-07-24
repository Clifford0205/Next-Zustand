import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoItem, TodoStore } from '@/types/TodoTypes';

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      
      addTodo: (text: string) => {
        const newTodo: TodoItem = {
          id: crypto.randomUUID(),
          text: text.trim(),
          completed: false,
          createdAt: new Date(),
        };
        
        set((state) => ({
          todos: [newTodo, ...state.todos],
        }));
      },
      
      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },
      
      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },
      
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }));
      },
      
      getTodosCount: () => {
        const todos = get().todos;
        return {
          total: todos.length,
          completed: todos.filter(todo => todo.completed).length,
          active: todos.filter(todo => !todo.completed).length,
        };
      },
    }),
    {
      name: 'todo-storage',
      partialize: (state) => ({ todos: state.todos }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.todos = state.todos.map((todo) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
          }));
        }
      },
    }
  )
);