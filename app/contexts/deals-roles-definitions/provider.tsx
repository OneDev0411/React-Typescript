import { useDealsRolesDefinitions } from '@app/hooks/use-deals-roles-definitions'

import { Context } from './context'

interface Props {
  children: React.ReactNode
}

export function DealRolesProvider({ children }: Props) {
  const [roles] = useDealsRolesDefinitions()

  return (
    <Context.Provider
      value={{
        roles
      }}
    >
      {children}
    </Context.Provider>
  )
}
