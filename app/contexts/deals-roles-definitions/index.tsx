import { useDealsRolesDefinitions } from '@app/hooks/use-deals-roles-definitions'

import { Context } from './context'

interface Props {
  children: React.ReactNode
}

export function DealRoles({ children }: Props) {
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
