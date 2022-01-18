import { ReactQueryProvider } from '../../app/views/components/ReactQueryProvider'

interface Props {
  children: React.ReactNode
}

export function ReactQueryTestBed({ children }: Props) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>
}
