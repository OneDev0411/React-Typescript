import React from 'react'
import { Link } from 'react-router'

import { primary } from '../../../../../views/utils/colors'
import {
  ListItem,
  ListItemName
} from '../../../../../views/components/SlideMenu/Menu/styled'
import Tooltip from '../../../../../views/components/tooltip'

const Item = ListItem.extend`
  justify-content: flex-start;

  .mls-nav-item--active > & {
    color: ${primary};
    font-weight: 500;

    > svg {
      fill: ${primary};
    }
  }
`

export function NavItem({ Icon, ...props }) {
  return (
    <Tooltip caption={props.caption} placement="right">
      <Link
        to={props.to}
        onlyActiveOnIndex={props.indexed}
        activeClassName="mls-nav-item--active"
      >
        <Item>
          <Icon style={{ marginRight: props.marginRight }} />
          <ListItemName>{props.text}</ListItemName>
        </Item>
      </Link>
    </Tooltip>
  )
}
