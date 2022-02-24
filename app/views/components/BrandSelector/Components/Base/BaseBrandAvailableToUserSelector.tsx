import { useTeams } from '../../hooks/use-teams'

import { BaseTreeViewBrandSelector } from './components/BaseTreeViewBrandSelector'
import { BaseBrandSelectorProps } from './type'

export function BaseBrandAvailableToUserSelector(
  props: BaseBrandSelectorProps
) {
  const {
    isError,
    isLoading,
    searchTerm,
    initialExpandedNodes,
    handleSearch,
    teams
  } = useTeams()

  return (
    <BaseTreeViewBrandSelector
      hasError={isError}
      isLoading={isLoading}
      searchTerm={searchTerm}
      initialExpandedNodes={initialExpandedNodes}
      handleSearch={handleSearch}
      nodes={teams}
      {...props}
    />
  )
}
