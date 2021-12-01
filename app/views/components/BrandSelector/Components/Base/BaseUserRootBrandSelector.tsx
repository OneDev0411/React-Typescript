import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'

import { useUserRootTeams } from '../../hooks/use-user-root-teams'

import { BaseTreeViewBrandSelector } from './components/BaseTreeViewBrandSelector'
import { BaseBrandSelectorProps } from './type'

export function BaseUserRootBrandSelector(props: BaseBrandSelectorProps) {
  const user = useSelector(selectUser)

  const { isError, isLoading, initialExpandedNodes, teams } =
    useUserRootTeams(user)

  return (
    <BaseTreeViewBrandSelector
      isLoading={isLoading}
      hasError={isError}
      initialExpandedNodes={initialExpandedNodes}
      nodes={teams}
      {...props}
    />
  )
}
