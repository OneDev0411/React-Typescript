import { useTeams } from '../../hooks/use-teams'

import { BaseTreeViewBrandSelector } from './components/BaseTreeViewBrandSelector'
import { BaseBrandSelectorProps } from './type'

export function BaseBrandAvailableToUserSelector(
  props: BaseBrandSelectorProps
) {
  const { isError, isLoading, teams, initialExpandedNodes } = useTeams()

  return (
    <BaseTreeViewBrandSelector
      isLoading={isLoading}
      hasError={isError}
      initialExpandedNodes={initialExpandedNodes}
      nodes={teams}
    />
  )
}
