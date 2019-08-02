import React from 'react'
import { Link } from 'react-router'

import { ListItemName } from 'components/SlideMenu/Menu/styled'
import { ListItem } from 'components/Grid/SavedSegments/List/styled'

export function ActiveItem(props) {
  const to = `${props.base}${props.item.url}`
  const selected =
    window.location.pathname === `/dashboard/insights${props.item.url}`

  return (
    <ListItem as={Link} to={to} isSelected={selected}>
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
    </ListItem>
  )
}
