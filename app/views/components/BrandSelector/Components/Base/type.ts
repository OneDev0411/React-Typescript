import { BaseTreeViewBrandSelectorProps } from './components/BaseTreeViewBrandSelector'

export type BaseBrandSelectorProps = Pick<
  BaseTreeViewBrandSelectorProps,
  'nodeRenderer' | 'onNodeClick'
>
