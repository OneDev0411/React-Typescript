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
        list: roles,
        byName: roles.reduce(
          (acc, item) => ({
            ...acc,
            [item.role]: item
          }),
          {}
        )
      }}
    >
      {children}
    </Context.Provider>
  )
}
