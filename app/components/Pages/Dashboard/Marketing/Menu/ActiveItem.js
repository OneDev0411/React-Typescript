import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'

import { primary } from 'views/utils/colors'
import { ListItemName } from 'components/SlideMenu/Menu/styled'

const Item = styled(Link)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #000;

  &.is-active {
    pointer-events: none;
    color: ${primary};
    font-weight: 500;
    text-decoration: none;

    > svg {
      fill: ${primary};
    }
  }
`

export function ActiveItem({ Icon, ...props }) {
  return (
    <Item
      to={props.to}
      onlyActiveOnIndex={props.indexed}
      activeClassName="is-active"
      className={props.selected ? 'is-active' : ''}
    >
      {Icon ? (
        <React.Fragment>
          <Icon style={{ marginRight: '0.5rem' }} />
          <ListItemName>{props.text}</ListItemName>
        </React.Fragment>
      ) : (
        props.text
      )}
    </Item>
  )
}
