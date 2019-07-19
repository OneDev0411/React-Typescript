import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router'

import { primary } from '../../../../../views/utils/colors'
import {
  ListItem,
  ListItemName
} from '../../../../../views/components/SlideMenu/Menu/styled'
import Tooltip from '../../../../../views/components/tooltip'

const Item = styled(ListItem)`
  justify-content: flex-start;

  > svg {
    width: 0.75rem;
    height: 0.75rem;
    margin-right: 0.875rem;
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
    <Tooltip caption={props.caption} placement="right">
      <Link
        to={props.to}
        onlyActiveOnIndex={props.indexed}
        activeClassName="mls-nav-item--active"
      >
        <Item>
          <Icon />
          <ListItemName>{props.text}</ListItemName>
        </Item>
      </Link>
    </Tooltip>
  )
}
