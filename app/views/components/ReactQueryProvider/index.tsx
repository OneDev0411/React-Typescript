import { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from 'react-query'

/*
  Create a query client instance
  Note: I just set some default options which I thought it's necessary for now,
  we can discuss on each option in the future.
*/
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000, // 30 seconds
      refetchInterval: 30000, // 30 seconds
      refetchIntervalInBackground: false,
      suspense: false
    }
  }
})

interface Props {
  children: ReactNode
}

export const ReactQueryProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
