# Zustand Todo Store 詳細教學

## 📋 概述

本檔案詳細解釋 `lib/todoStore.ts` 中的 Zustand 狀態管理實作，包含所有功能的運作原理和最佳實踐。

## 🏗️ Store 架構解析

### 基本匯入

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoItem, TodoStore } from '@/types/TodoTypes';
```

- `create`: Zustand 的核心函數，用於建立狀態管理 store
- `persist`: 中間件，提供本地存儲持久化功能
- `TodoItem, TodoStore`: TypeScript 類型定義，確保類型安全

### Store 建立語法

```typescript
export const useTodoStore = create<TodoStore>()(
  persist(
    // Store 定義
  )
);
```

**語法解析：**
- `create<TodoStore>()()` - 雙重括號語法，用於支援中間件
- `persist()` - 包裝 store，添加持久化功能
- `<TodoStore>` - TypeScript 泛型，指定 store 類型

## 🔧 核心功能實作

### 1. 狀態初始化

```typescript
todos: [],
```
- 初始化空陣列存放所有待辦事項
- 符合 `TodoItem[]` 類型定義

### 2. 新增待辦事項 (addTodo)

```typescript
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
```

**功能說明：**
- `crypto.randomUUID()`: 產生唯一 ID
- `text.trim()`: 移除前後空白
- `completed: false`: 預設未完成狀態
- `createdAt: new Date()`: 記錄建立時間
- `[newTodo, ...state.todos]`: 新項目放在陣列最前面

**Zustand 重點：**
- 使用 `set()` 函數更新狀態
- 透過回調函數接收當前狀態
- 返回新的狀態物件（不可變更新）

### 3. 切換完成狀態 (toggleTodo)

```typescript
toggleTodo: (id: string) => {
  set((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  }));
},
```

**功能說明：**
- 使用 `map()` 遍歷所有待辦事項
- 找到匹配 ID 的項目，切換其 `completed` 狀態
- 其他項目保持不變
- 使用展開運算符 `...todo` 保持其他屬性

### 4. 刪除待辦事項 (deleteTodo)

```typescript
deleteTodo: (id: string) => {
  set((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  }));
},
```

**功能說明：**
- 使用 `filter()` 過濾掉指定 ID 的項目
- 返回不包含該項目的新陣列

### 5. 清除已完成項目 (clearCompleted)

```typescript
clearCompleted: () => {
  set((state) => ({
    todos: state.todos.filter((todo) => !todo.completed),
  }));
},
```

**功能說明：**
- 過濾掉所有已完成的項目
- 只保留未完成的待辦事項

### 6. 統計功能 (getTodosCount)

```typescript
getTodosCount: () => {
  const todos = get().todos;
  return {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
  };
},
```

**功能說明：**
- 使用 `get()` 函數獲取當前狀態
- 計算總數、已完成數、進行中數量
- 返回統計物件

**重要概念：**
- `get()` vs `set()`: `get()` 讀取狀態，`set()` 更新狀態
- 不會觸發重新渲染，適合計算衍生資料

## 💾 持久化中間件詳解

### 基本配置

```typescript
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
```

### 1. name: 'todo-storage'
- localStorage 的鍵名
- 資料會存儲在 `localStorage['todo-storage']`

### 2. partialize 選擇性序列化

```typescript
partialize: (state) => ({ todos: state.todos })
```

**功能說明：**
- 只序列化 `todos` 陣列到 localStorage
- 其他狀態（如方法）不會被儲存
- 減少存儲空間，提升效能

### 3. onRehydrateStorage 資料恢復處理

```typescript
onRehydrateStorage: () => (state) => {
  if (state) {
    state.todos = state.todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  }
}
```

**問題解決：**
- localStorage 只能存儲字串
- `Date` 物件會被序列化為字串
- 恢復時需要重新轉換為 `Date` 物件
- 確保 `toLocaleTimeString()` 等方法正常運作

## 🎯 使用方式

### 在元件中使用

```typescript
// 匯入 hook
import { useTodoStore } from '@/lib/todoStore';

// 在元件中使用
function MyComponent() {
  // 選擇性訂閱狀態
  const todos = useTodoStore((state) => state.todos);
  const addTodo = useTodoStore((state) => state.addTodo);
  
  // 或者解構多個狀態/方法
  const { todos, addTodo, toggleTodo } = useTodoStore();
  
  return (
    // JSX 內容
  );
}
```

### 選擇性訂閱的好處

```typescript
// 只當 todos 陣列變化時重新渲染
const todos = useTodoStore((state) => state.todos);

// 只當統計資料變化時重新渲染
const counts = useTodoStore((state) => state.getTodosCount());
```

## ✨ Zustand 的優勢

### 1. 簡潔的 API
- 無需 Provider 包裝
- 最小化樣板代碼
- 直觀的狀態更新

### 2. 優秀的 TypeScript 支援
- 完整的類型推斷
- 編譯時錯誤檢查
- 智能程式碼提示

### 3. 靈活的訂閱機制
- 選擇性訂閱特定狀態
- 減少不必要的重新渲染
- 優化效能

### 4. 豐富的中間件生態
- persist: 持久化
- devtools: 開發工具
- immer: 不可變更新
- subscribeWithSelector: 進階訂閱

## 🔍 除錯技巧

### 1. 開發工具整合

```typescript
import { devtools } from 'zustand/middleware';

export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      // store 定義
    ),
    { name: 'TodoStore' }
  )
);
```

### 2. 日誌中間件

```typescript
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('  applying', args);
      set(...args);
      console.log('  new state', get());
    },
    get,
    api
  );
```

## 📚 進階主題

### 1. 非同步操作

```typescript
fetchTodos: async () => {
  const response = await fetch('/api/todos');
  const todos = await response.json();
  set({ todos });
},
```

### 2. 中間件組合

```typescript
export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      immer((set) => ({
        // 使用 immer 進行可變更新
      }))
    )
  )
);
```

### 3. 多個 Store 協作

```typescript
// 在一個 store 中使用另一個 store
const userStore = useUserStore.getState();
const currentUser = userStore.currentUser;
```

## 🎉 總結

Zustand 提供了一個輕量、靈活且強大的狀態管理解決方案。透過這個 Todo Store 範例，您學習了：

- 基本的 store 建立和狀態管理
- 持久化中間件的使用
- TypeScript 整合的最佳實踐
- 效能優化技巧

這些概念可以應用到任何規模的 React 應用程式中！