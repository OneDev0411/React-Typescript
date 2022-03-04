import { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from 'react-query'

/*
  Create a query client instance
  Note: I just set some default options which I thought it's necessary for now,
  we can discuss on each option in the future.
*/
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000 // 30 seconds
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
