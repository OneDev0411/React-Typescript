import React from 'react'
import { Link } from 'react-router'

import { primary } from '../../../../../views/utils/colors'
import {
  ListItem,
  ListItemName
} from '../../../../../views/components/SlideMenu/Menu/styled'

const Item = ListItem.extend`
  justify-content: initial;

  > svg {
    width: 1.5em;
    height: 1.5em;
  }

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
    <Link
      to={props.to}
      onlyActiveOnIndex={props.indexed}
      activeClassName="mls-nav-item--active"
    >
      <Item>
        <Icon style={{ marginRight: '0.5em' }} />
        <ListItemName>{props.text}</ListItemName>
      </Item>
    </Link>
  )
}
