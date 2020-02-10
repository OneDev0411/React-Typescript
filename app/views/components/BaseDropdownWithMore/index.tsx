import * as React from 'react'
import { ReactNode } from 'react'
import { List, ListProps } from '@material-ui/core'

import { BaseDropdown, Props as BaseProps } from '../BaseDropdown'
import { ShowMoreLess } from '../ShowMoreLess'

interface Props extends BaseProps {
  renderMenu: (renderProps: { close: () => void }) => ReactNode[]
  listPlugin?: ListProps
  morePlugin?: {
    defaultIsOpen: boolean
    row: boolean
    column: boolean
    count: number
    moreText: string
    lessText: string
  }
}

export function BaseDropdownWithMore({
  renderMenu,
  morePlugin,
  ...props
}: Props) {
  return (
    <BaseDropdown
      {...props}
      renderMenu={props => (
        <List>
          <ShowMoreLess
            {...morePlugin}
            style={{ maxHeight: 350, overflow: 'auto' }}
          >
            {renderMenu(props)}
          </ShowMoreLess>
        </List>
      )}
    />
  )
}
