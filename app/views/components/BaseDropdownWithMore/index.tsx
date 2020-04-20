import * as React from 'react'
import { ReactNode } from 'react'
import { List, ListProps } from '@material-ui/core'

import { BaseDropdown, Props as BaseProps } from '../BaseDropdown'
import { ShowMoreLess } from '../ShowMoreLess'

interface Props extends BaseProps {
  renderMenu: (renderProps: { close: () => void }) => ReactNode[]
  listPlugin?: ListProps
  morePlugin?: {
    defaultOpen?: boolean
    row?: boolean
    column?: boolean
    count?: number
    textContainer?: ReactNode
    moreText?: string
    lessText?: string
    textStyle?: object
    style?: object
  }
}

export function BaseDropdownWithMore({
  renderMenu,
  listPlugin,
  morePlugin,
  ...props
}: Props) {
  const basicShowMoreStyle = { maxHeight: 350, overflow: 'auto' }
  const showMoreStyle =
    morePlugin && morePlugin.style
      ? { ...morePlugin.style, ...basicShowMoreStyle }
      : basicShowMoreStyle

  return (
    <BaseDropdown
      {...props}
      renderMenu={props => (
        <List {...listPlugin}>
          <ShowMoreLess {...morePlugin} style={showMoreStyle}>
            {renderMenu(props)}
          </ShowMoreLess>
        </List>
      )}
    />
  )
}
