import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'

import { useUserRootTeams } from '../../hooks/use-user-root-teams'

import {
  BaseTreeViewBrandSelector,
  BaseTreeViewBrandSelectorProps
} from './components/BaseTreeViewBrandSelector'

export type BaseUserRootBrandSelectorProps = Pick<
  BaseTreeViewBrandSelectorProps,
  'nodeRenderer' | 'onNodeClick'
>

export function BaseUserRootBrandSelector(
  props: BaseUserRootBrandSelectorProps
) {
  const user = useSelector(selectUser)

  const { isError, isLoading, initialExpandedNodes, teamNodes } =
    useUserRootTeams(user)

  return (
    <BaseTreeViewBrandSelector
      isLoading={isLoading}
      hasError={isError}
      initialExpandedNodes={initialExpandedNodes}
      nodes={teamNodes}
    />
  )
}
