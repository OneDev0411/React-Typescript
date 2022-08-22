import { useUserRootTeams } from '../../hooks/use-user-root-teams'

import { BaseTreeViewBrandSelector } from './components/BaseTreeViewBrandSelector'
import { BaseBrandSelectorProps } from './type'

export interface BaseUserRootBrandSelectorProps extends BaseBrandSelectorProps {
  rootBrandId?: UUID
}

export function BaseUserRootBrandSelector({
  rootBrandId,
  filterFn,
  ...props
}: BaseUserRootBrandSelectorProps) {
  const {
    isError,
    isLoading,
    searchTerm,
    initialExpandedNodes,
    handleSearch,
    teams
  } = useUserRootTeams(rootBrandId, filterFn)

  return (
    <BaseTreeViewBrandSelector
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      isLoading={isLoading}
      hasError={isError}
      initialExpandedNodes={initialExpandedNodes}
      nodes={teams}
      {...props}
    />
  )
}
