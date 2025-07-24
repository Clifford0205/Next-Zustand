# TypeScript 泛型 (Generics) 完整教學

## 📋 什麼是泛型？

泛型是 TypeScript 中一個強大的功能，允許我們建立可重複使用的元件，這些元件可以處理多種類型，同時保持類型安全。

**簡單理解：** 泛型就像是「類型的變數」，可以在使用時指定具體類型。

## 🎯 為什麼需要泛型？

### 問題：沒有泛型的情況

```typescript
// 只能處理 string 陣列
function getFirstString(items: string[]): string {
  return items[0];
}

// 只能處理 number 陣列
function getFirstNumber(items: number[]): number {
  return items[0];
}

// 需要為每種類型寫不同的函數... 😵
```

### 解決方案：使用泛型

```typescript
// 一個函數處理所有類型！
function getFirst<T>(items: T[]): T {
  return items[0];
}

// 使用時指定類型
const firstString = getFirst<string>(['a', 'b', 'c']); // 返回 string
const firstNumber = getFirst<number>([1, 2, 3]);      // 返回 number
```

## 🔤 基本語法

### 1. 函數泛型

```typescript
// 基本語法：在函數名後加 <T>
function identity<T>(arg: T): T {
  return arg;
}

// 使用方式 1：明確指定類型
const result1 = identity<string>("hello");

// 使用方式 2：讓 TypeScript 自動推斷
const result2 = identity("hello"); // TypeScript 推斷為 string
```

### 2. 多個泛型參數

```typescript
function combine<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = combine<string, number>("hello", 42);
// result 的類型是 [string, number]
```

### 3. 介面泛型

```typescript
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

// 使用泛型介面
const stringContainer: Container<string> = {
  value: "hello",
  getValue() { return this.value; },
  setValue(value: string) { this.value = value; }
};
```

## 🛠️ 實際範例

### 範例 1：陣列工具函數

```typescript
// 泛型工具函數
function findItem<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  return items.find(predicate);
}

// 使用範例
const numbers = [1, 2, 3, 4, 5];
const evenNumber = findItem<number>(numbers, x => x % 2 === 0);
// evenNumber 的類型是 number | undefined

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];
const adult = findItem(users, user => user.age >= 18);
// TypeScript 自動推斷類型
```

### 範例 2：API 回應處理

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 不同的 API 回應
type UserResponse = ApiResponse<{ id: number; name: string }>;
type PostResponse = ApiResponse<{ title: string; content: string }>;

// 泛型 API 函數
async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// 使用時指定返回類型
const userData = await fetchData<{ id: number; name: string }>('/api/user');
```

### 範例 3：狀態管理 Hook

```typescript
interface UseStateResult<T> {
  value: T;
  setValue: (value: T) => void;
  reset: () => void;
}

function useState<T>(initialValue: T): UseStateResult<T> {
  let currentValue = initialValue;
  
  return {
    get value() { return currentValue; },
    setValue: (value: T) => { currentValue = value; },
    reset: () => { currentValue = initialValue; }
  };
}

// 使用範例
const stringState = useState<string>("hello");
const numberState = useState<number>(0);
const booleanState = useState<boolean>(false);
```

## 🎮 Zustand 中的泛型解析

### 回到原問題：`create<TodoStore>()`

```typescript
// 這裡的 <TodoStore> 是泛型參數
export const useTodoStore = create<TodoStore>()(
  persist(
    // store 實作
  )
);
```

### 分解理解

```typescript
// 1. TodoStore 是我們定義的介面
interface TodoStore {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  // ... 其他方法
}

// 2. create 函數的泛型簽名（簡化版）
function create<T>(storeImplementation: T): UseStore<T> {
  // 內部實作
}

// 3. 當我們寫 create<TodoStore> 時
// 相當於告訴 TypeScript：「T = TodoStore」
// 確保我們的實作符合 TodoStore 介面
```

### 為什麼需要指定 `<TodoStore>`？

```typescript
// 沒有泛型：TypeScript 無法知道 store 的結構
const store1 = create(() => ({ count: 0 })); 
// store1 的類型是 unknown，沒有類型安全

// 有泛型：TypeScript 知道 store 必須符合 TodoStore
const store2 = create<TodoStore>(() => ({
  todos: [],
  addTodo: (text: string) => { /* 實作 */ },
  // 如果少了任何屬性，TypeScript 會報錯！
}));
```

## 🔒 泛型約束 (Generic Constraints)

### 基本約束

```typescript
// 約束 T 必須有 length 屬性
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength("hello");    // ✅ string 有 length
getLength([1, 2, 3]);  // ✅ array 有 length
getLength({ length: 5 }); // ✅ 物件有 length
// getLength(123);     // ❌ number 沒有 length
```

### 鍵約束

```typescript
// K 必須是 T 的鍵之一
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 25, city: "Taipei" };

const name = getProperty(person, "name");  // 類型是 string
const age = getProperty(person, "age");    // 類型是 number
// getProperty(person, "height"); // ❌ 'height' 不存在
```

## 🧩 進階泛型模式

### 1. 條件類型

```typescript
// 如果 T 是陣列，返回元素類型；否則返回 T
type Flatten<T> = T extends (infer U)[] ? U : T;

type StringArray = Flatten<string[]>; // string
type JustString = Flatten<string>;    // string
```

### 2. 映射類型

```typescript
// 讓所有屬性變成可選
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// 等同於：
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }
```

### 3. 工具類型

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// 只選擇特定屬性
type TodoPreview = Pick<Todo, 'id' | 'text'>;
// { id: string; text: string; }

// 排除特定屬性
type TodoWithoutDate = Omit<Todo, 'createdAt'>;
// { id: string; text: string; completed: boolean; }

// 讓所有屬性必填
type RequiredTodo = Required<Partial<Todo>>;
```

## 🎯 實戰應用

### 建立通用的資料存取層

```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// 具體實作
interface User extends BaseEntity {
  name: string;
  email: string;
}

interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // 實作
    return null;
  }
  
  async create(data: Omit<User, keyof BaseEntity>): Promise<User> {
    // data 的類型是 { name: string; email: string; }
    // TypeScript 確保我們不會意外包含 id, createdAt, updatedAt
    return {} as User;
  }
  
  // ... 其他方法實作
}
```

### 建立類型安全的事件系統

```typescript
interface EventMap {
  'user-login': { userId: string; timestamp: Date };
  'user-logout': { userId: string };
  'post-created': { postId: string; authorId: string };
}

class EventEmitter {
  private listeners: { [K in keyof EventMap]?: Array<(data: EventMap[K]) => void> } = {};

  on<K extends keyof EventMap>(event: K, callback: (data: EventMap[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// 使用時完全類型安全
const emitter = new EventEmitter();

emitter.on('user-login', (data) => {
  // data 的類型自動推斷為 { userId: string; timestamp: Date }
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit('user-login', { 
  userId: '123', 
  timestamp: new Date() 
});
```

## 💡 最佳實踐

### 1. 命名約定

```typescript
// 常見泛型參數名稱
T        // Type (最常用)
K        // Key  
V        // Value
E        // Element
P        // Property
R        // Return type

// 多個泛型時使用描述性名稱
interface ApiClient<TRequest, TResponse> {
  send(request: TRequest): Promise<TResponse>;
}
```

### 2. 預設泛型參數

```typescript
interface Container<T = string> {
  value: T;
}

const stringContainer: Container = { value: "hello" }; // T = string (預設)
const numberContainer: Container<number> = { value: 42 }; // T = number
```

### 3. 泛型約束的合理使用

```typescript
// 好的約束：有意義且必要
function updateEntity<T extends { id: string }>(entity: T, updates: Partial<T>): T {
  return { ...entity, ...updates };
}

// 避免過度約束
function process<T extends string | number | boolean>(value: T): T {
  // 這個約束可能不必要，直接用 T 就好
  return value;
}
```

## 🎉 總結

泛型是 TypeScript 的核心功能之一，它讓我們能夠：

1. **建立可重複使用的程式碼** - 一個函數處理多種類型
2. **保持類型安全** - 編譯時捕獲錯誤
3. **提升開發體驗** - 更好的 IDE 支援和自動完成
4. **建立靈活的 API** - 適應不同的使用場景

### 在 Zustand 中的應用

```typescript
// 當我們寫 create<TodoStore> 時：
// 1. 告訴 TypeScript store 的結構
// 2. 確保實作符合介面定義
// 3. 提供完整的類型檢查和智能提示
// 4. 在使用 store 時獲得類型安全

export const useTodoStore = create<TodoStore>()(/* ... */);
//                            ^^^^^^^^^^^
//                            這裡指定了泛型類型
```

掌握泛型後，你就能寫出更安全、更靈活、更易維護的 TypeScript 程式碼！