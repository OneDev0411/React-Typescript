import React from 'react'
import { Link } from 'react-router'
import styled from 'styled-components'
import cn from 'classnames'

import { primary } from 'views/utils/colors'
import { ListItemName } from 'components/SlideMenu/Menu/styled'

const Item = styled(Link) `
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #000;

  &:hover {
    text-decoration: none;
  }

  &.is-active .item-title {
    pointer-events: none;
    color: ${primary};
    font-weight: 500;
    text-decoration: none;

    > svg {
      fill: ${primary};
    }
  }

  & .item-title {
  }

  & .item-badge {
  }
`

export function ActiveItem(props) {
  const indexed = props.item.url === '/'
  const to = `${props.base}${props.item.url}`
  const selected = window.location.pathname.includes(props.item.url)

  return (
    <Item
      to={to}
      onlyActiveOnIndex={indexed}
      activeClassName="is-active"
      className={cn(props.className, { 'is-active': selected })}
    >
      <span className="item-title">
        {props.Icon ? (
          <React.Fragment>
            <Icon style={{ marginRight: '0.5rem' }} />
            <ListItemName>{props.item.title}</ListItemName>
          </React.Fragment>
        ) : (
            props.item.title
          )}
      </span>

      {props.item.badge ? (
        <span className="item-badge">{props.item.badge}</span>
      ) : null}
    </Item>
  )
}
