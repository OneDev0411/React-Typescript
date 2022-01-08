import { useUserRootTeams } from '../../hooks/use-user-root-teams'

import { BaseTreeViewBrandSelector } from './components/BaseTreeViewBrandSelector'
import { BaseBrandSelectorProps } from './type'

export function BaseUserRootBrandSelector(props: BaseBrandSelectorProps) {
  const { isError, isLoading, initialExpandedNodes, teams } = useUserRootTeams()

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
