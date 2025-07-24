import { getQueryClient } from '@/lib/queryClient';
import { fetchUsers, USER_QUERY_KEY } from '@/lib/api';
import { dehydrate } from '@tanstack/react-query';
import { HydrationBoundary } from './HydrationBoundary';
import { UserListClient } from './UserListClient';

// Server Component - 預取資料
export async function UserList() {
  const queryClient = getQueryClient();

  // 在伺服器端預取資料
  await queryClient.prefetchQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUsers,
  });

  // 序列化狀態以傳遞給客戶端
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary dehydratedState={dehydratedState}>
      <UserListClient />
    </HydrationBoundary>
  );
}