import { useDealsRolesContext } from '@app/contexts/deals-roles-definitions/use-deals-roles-context'

interface Props {
  name: string
}

export function RoleName({ name }: Props) {
  const { dealRolesByName } = useDealsRolesContext()

  return <>{dealRolesByName[name]?.title}</>
}
