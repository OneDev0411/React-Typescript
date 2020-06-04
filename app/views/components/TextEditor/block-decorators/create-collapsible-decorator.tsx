import * as React from 'react'
import { useCallback, useState } from 'react'
import { Tooltip } from '@material-ui/core'

import { ThreeDotsButton } from '../../ThreeDotsButton'

interface Options {
  defaultCollapsed?: boolean
  /**
   * tooltip for toggle button
   */
  tooltip?: string
}

export const createCollapsibleDecorator = <P extends {}>({
  defaultCollapsed,
  tooltip = 'Show trimmed content'
}: Options) => (Component: React.ComponentType<P>) => {
  return function CollapsibleBlock(props: P) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed)

    const toggle = useCallback(() => setCollapsed(collapsed => !collapsed), [])

    return collapsed ? (
      <Tooltip title={tooltip}>
        <ThreeDotsButton onClick={toggle} />
      </Tooltip>
    ) : (
      <Component toggle={toggle} {...props} />
    )
  }
}
