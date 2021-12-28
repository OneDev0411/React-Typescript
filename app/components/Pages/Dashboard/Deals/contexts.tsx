import { DealRolesProvider } from '@app/contexts/deals-roles-definitions/provider'

interface Props {
  children: React.ReactNode
}

export function DealContextProviders({ children }: Props) {
  return <DealRolesProvider>{children}</DealRolesProvider>
}
