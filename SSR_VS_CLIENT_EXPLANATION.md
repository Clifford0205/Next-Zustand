# Next.js App Router + React Query SSR 完整教學

## 🤔 常見誤解

**錯誤認知：** `'use client'` = 不會 SSR  
**正確認知：** `'use client'` = 需要客戶端 JavaScript，但仍然會 SSR

## 📋 基本概念

### 1. SSR (Server-Side Rendering) 的定義
SSR 是指在**伺服器端生成完整的 HTML**，然後發送給瀏覽器。

### 2. 'use client' 的真正作用
- 標記**客戶端邊界** (Client Boundary)
- 告訴 Next.js 這個元件需要在**客戶端執行 JavaScript**
- **不影響** SSR 的 HTML 生成

## 🔄 Next.js App Router 的渲染流程

### 階段 1: 伺服器端渲染 (SSR)
```
1. 用戶請求頁面
2. Next.js 在伺服器端執行所有元件 (包含 'use client')
3. 生成完整的 HTML (包含資料)
4. 發送 HTML + CSS + JS bundle 給瀏覽器
```

### 階段 2: 客戶端接管 (Hydration)
```
1. 瀏覽器接收並顯示 HTML (用戶立即看到內容)
2. 下載並執行 JavaScript bundle
3. React 接管 DOM (Hydration)
4. 'use client' 元件變成互動式
```

## 🏗️ 我們的簡化架構

### 當前的架構設計

```typescript
// ✅ 簡化的架構
app/layout.tsx (Server Component)
├── ReactQueryProvider (Client Component) - 全域 Provider
    └── app/page.tsx (Server Component) - 預取資料
        ├── HydrationBoundary - 狀態傳遞
        └── UserList (Client Component) - 使用資料
```

### 為什麼這個架構更好？

1. **全域 Provider** - 一次設定，整個應用可用
2. **頁面層預取** - 每個頁面控制自己的資料需求
3. **簡單的 Hydration** - 直接使用 React Query 的 HydrationBoundary

## 💻 實際程式碼解析

### 1. 全域 ReactQueryProvider (layout.tsx)

```typescript
// app/layout.tsx
import { ReactQueryProvider } from "@/utils/ReactQueryProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>  {/* 全域 React Query 上下文 */}
          {children}          {/* 所有頁面都能使用 useQuery */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
```

**為什麼需要全域 Provider：**
- 所有頁面都能使用 React Query
- 避免重複設定 QueryClient
- 統一的快取和配置管理

### 2. 頁面層資料預取 (page.tsx)

```typescript
// app/page.tsx (Server Component)
export default async function Home() {
  const queryClient = new QueryClient();

  // ✅ 在伺服器端預取資料
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div>
      {/* Server Component 內容 */}
      <h1>Zustand 狀態管理教學</h1>
      
      {/* 使用 HydrationBoundary 傳遞狀態 */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserList />  {/* Client Component */}
      </HydrationBoundary>
      
      {/* 更多 Server Component 內容 */}
      <TodoList />
    </div>
  );
}
```

**關鍵點：**
- `page.tsx` 是 **Server Component** - 真正的 SSR 預取
- 使用 `new QueryClient()` 建立伺服器端專用的 QueryClient
- 用 `HydrationBoundary` 將狀態傳遞給客戶端

### 3. 客戶端元件使用資料 (UserList.tsx)

```typescript
// components/UserList.tsx (Client Component)
'use client';

export function UserList() {
  // ✅ 直接使用 useQuery，資料已經被預取
  const { data: users, isLoading, error, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // 因為有 SSR 預取，isLoading 通常是 false
  // 資料立即可用，無需 loading 狀態
  
  return (
    <div>
      {users?.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
```

**重要觀察：**
- `isLoading` 通常是 `false` (因為資料已預取)
- `isFetching` 顯示背景更新狀態
- 用戶立即看到內容，無 loading 畫面

## 🌊 HydrationBoundary 詳解

### 什麼是 Hydration？

**Hydration** 是將伺服器端渲染的靜態 HTML 轉換為可互動的 React 應用的過程。

```
靜態 HTML → 下載 JS → React 接管 → 可互動 App
```

### React Query 的 SSR 挑戰

#### 問題：狀態不同步
```typescript
// 伺服器端 (10:00 AM)
const serverData = await fetchUsers(); // 取得 10 個用戶

// 客戶端 (10:00:03 AM)
const { data } = useQuery(fetchUsers); // 可能取得 11 個用戶 (新增了 1 個)
```

**結果：** Hydration 不匹配錯誤！

### HydrationBoundary 的解決方案

```typescript
// ✅ 使用 HydrationBoundary
<HydrationBoundary state={dehydrate(queryClient)}>
  <UserList />
</HydrationBoundary>
```

**HydrationBoundary 做了什麼：**

1. **接收序列化狀態** - 從伺服器端接收 `dehydrate(queryClient)`
2. **重建快取** - 在客戶端 QueryClient 中重建相同的快取
3. **確保同步** - 客戶端使用與伺服器端相同的資料
4. **防止不匹配** - 避免 React Hydration 錯誤

### dehydrate() 和 rehydrate 流程

#### 1. 伺服器端序列化 (dehydrate)

```typescript
// 在 Server Component 中
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

// 將 QueryClient 狀態序列化為 JSON
const dehydratedState = dehydrate(queryClient);
```

**dehydrate() 產生的資料：**
```javascript
{
  "queries": [
    {
      "queryKey": ["users"],
      "queryHash": "[\"users\"]",
      "state": {
        "data": [
          { "id": 1, "name": "John", "email": "john@example.com" },
          { "id": 2, "name": "Jane", "email": "jane@example.com" }
        ],
        "status": "success",
        "dataUpdatedAt": 1640995200000,
        "error": null
      }
    }
  ],
  "mutations": []
}
```

#### 2. 客戶端重建 (rehydrate)

```typescript
// HydrationBoundary 內部流程
function HydrationBoundary({ state, children }) {
  const queryClient = useQueryClient(); // 從全域 Provider 取得
  
  // 將 dehydrated state 注入到 QueryClient
  useEffect(() => {
    if (state) {
      hydrate(queryClient, state); // 重建快取
    }
  }, [queryClient, state]);
  
  return <>{children}</>;
}
```

## 🚀 完整的 SSR + React Query 流程

### 階段 1: 伺服器端 (預取與序列化)

```typescript
1. 用戶請求 "/" 頁面
2. Next.js 執行 page.tsx (Server Component)
3. 建立新的 QueryClient
4. 執行 prefetchQuery，獲取用戶資料
5. 將 QueryClient 狀態序列化 (dehydrate)
6. 渲染完整 HTML，包含用戶卡片
7. 將序列化狀態嵌入 HTML
```

### 階段 2: 客戶端 (接收與 Hydration)

```typescript
1. 瀏覽器接收並顯示 HTML (用戶立即看到用戶卡片)
2. 下載 React Query JavaScript bundle
3. ReactQueryProvider 建立客戶端 QueryClient
4. HydrationBoundary 將序列化狀態注入客戶端 QueryClient
5. UserList 元件使用 useQuery，直接取得快取資料
6. 無 loading 狀態，用戶體驗流暢
```

### 階段 3: 背景更新 (持續優化)

```typescript
1. React Query 根據 staleTime 判斷資料是否過期
2. 如果過期，背景發送新的 API 請求
3. 更新快取，UI 自動重新渲染
4. 用戶看到最新資料，體驗無縫
```

## 📊 架構對比

### 傳統 CSR (Client-Side Rendering)
```
1. 發送空白 HTML
2. 下載 JavaScript
3. 顯示 Loading
4. 發送 API 請求  
5. 顯示資料
```

### 我們的 SSR + React Query
```
1. 發送包含資料的完整 HTML
2. 用戶立即看到內容
3. 下載 JavaScript (背景進行)
4. Hydration 接管
5. 背景更新資料 (如果需要)
```

## 🎯 各種頁面使用範例

### 範例 1: 首頁 (當前實作)

```typescript
// app/page.tsx
export default async function Home() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div>
      <Header />              {/* Server Component */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserList />          {/* Client Component with SSR data */}
      </HydrationBoundary>
      <TodoList />            {/* Client Component - Zustand */}
    </div>
  );
}
```

### 範例 2: 產品頁面

```typescript
// app/products/page.tsx
export default async function ProductsPage() {
  const queryClient = new QueryClient();
  
  // 預取產品資料
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <div>
      <ProductHeader />       {/* Server Component */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductList />       {/* Client Component with SSR data */}
      </HydrationBoundary>
    </div>
  );
}
```

### 範例 3: 多個 API 預取

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const queryClient = new QueryClient();
  
  // 同時預取多個 API
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
    }),
    queryClient.prefetchQuery({
      queryKey: ['stats'],
      queryFn: fetchStats,
    }),
  ]);

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserList />
        <StatsDashboard />
      </HydrationBoundary>
    </div>
  );
}
```

## 🔍 實際驗證方法

### 方法 1: 檢查網頁原始碼
```bash
# 在瀏覽器中按 Ctrl+U 查看原始碼
# 你會看到完整的用戶資料已經在 HTML 中
```

### 方法 2: 停用 JavaScript
```javascript
// 在 Chrome DevTools 中停用 JS
// Settings > Preferences > Debugger > Disable JavaScript
// 重新整理頁面，你仍然能看到用戶卡片
```

### 方法 3: Network 分析
```bash
# 在 Network tab 中查看：
# 1. 初始 HTML 請求已包含完整用戶資料
# 2. 沒有額外的 /users API 請求 (因為資料已預取)
```

### 方法 4: React Query DevTools
```typescript
// 檢查快取狀態
// 開啟 DevTools，查看 queries 狀態
// 應該看到 ['users'] query 狀態為 'success'，而不是 'loading'
```

## ⚡ 效能優勢

### 1. 更快的首次內容呈現 (FCP)
- 用戶立即看到完整內容
- 無 loading 骨架屏
- 更好的 Core Web Vitals 分數

### 2. 零重複 API 請求
- 伺服器端已獲取資料
- 客戶端直接使用快取
- 減少伺服器負載

### 3. 更好的 SEO
- 搜尋引擎看到完整 HTML
- 動態內容可被索引
- 社交媒體分享正常顯示

### 4. 漸進式增強
- 即使 JavaScript 失敗，內容仍可見
- 更好的可靠性和可存取性

## 🛠️ 除錯技巧

### 檢查 SSR 預取
```typescript
// 在 page.tsx 中添加日誌
export default async function Home() {
  const queryClient = new QueryClient();
  
  console.log('🚀 開始預取用戶資料...');
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  console.log('✅ 預取完成！');

  const dehydratedState = dehydrate(queryClient);
  console.log('📦 序列化狀態:', dehydratedState);
  
  return (/* JSX */);
}
```

### 檢查客戶端 Hydration
```typescript
// 在 UserList.tsx 中添加日誌
export function UserList() {
  const { data, status, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  console.log('🔍 Query 狀態:', { status, isLoading, hasData: !!data });
  
  return (/* JSX */);
}
```

## 🎉 總結

### 我們學到了什麼

1. **'use client' ≠ 不 SSR** - 客戶端元件仍然會在伺服器端渲染
2. **全域 Provider 策略** - 在 layout 設定，整個應用受益
3. **頁面層預取模式** - 每個頁面控制自己的資料需求
4. **HydrationBoundary 的威力** - 無縫的伺服器到客戶端狀態傳遞

### 最佳實踐總結

```typescript
// ✅ 推薦的架構模式
layout.tsx → ReactQueryProvider (全域設定)
page.tsx → Server Component + prefetchQuery (資料預取)
page.tsx → HydrationBoundary (狀態傳遞)
components → Client Components + useQuery (資料使用)
```

### 核心優勢

- 🚀 **極快的首次載入** - 用戶立即看到內容
- 🔄 **無縫的互動性** - JavaScript 載入後自動接管
- 📈 **優秀的 SEO** - 完整的 HTML 內容
- 🛡️ **類型安全** - TypeScript 全程守護
- 🎯 **開發體驗** - 簡潔一致的開發模式

這就是 **Next.js 15 App Router + React Query** 的現代 SSR 最佳實踐！🎯