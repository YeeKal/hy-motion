import useSWR from 'swr';

export const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  
  // 如果状态码不是 2xx，抛出错误以便 SWR 捕获
  if (!res.ok) {
    console.log("Failed to fetch credits:");
  }
  
  return res.json();
};

export function useCredits() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/credits', fetcher, {
    refreshInterval: 0, // 不用自动轮询，按需更新
    revalidateOnFocus: true, // 窗口切回来时自动检查最新积分
  });

  return {
    credits: data?.credits?? 0,
    subscriptionTier: data?.subscriptionTier?? "FREE",
    isLoading,
    isError: error,
    refreshCredits: mutate, // 暴露刷新方法
  };
}