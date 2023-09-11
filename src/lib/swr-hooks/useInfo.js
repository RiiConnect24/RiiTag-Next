import useSWR from 'swr';

export default function useInfo() {
  const { data, error, mutate } = useSWR(`/api/account/me`);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
