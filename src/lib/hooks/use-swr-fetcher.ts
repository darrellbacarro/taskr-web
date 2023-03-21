import useSWR from 'swr';

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export function useSWRFetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
) {
  return useSWR<JSON>(input, () => fetcher(input, init));
}