import { QueryClient } from '@tanstack/react-query';

// 建立 QueryClient 工廠函數，每次 SSR 都建立新的實例
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR 時不要立即重新獲取
        staleTime: 60 * 1000, // 1 分鐘
        gcTime: 1000 * 60 * 60 * 24, // 24 小時
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

// 獲取 QueryClient 實例
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: 總是建立新的 QueryClient
    return makeQueryClient();
  } else {
    // Browser: 重複使用現有的 QueryClient 或建立新的
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;  
  }
}