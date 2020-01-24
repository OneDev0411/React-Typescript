import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { SideNavTooltip } from './Tooltip'
import { SideNavItem, SidenavLink } from '../styled'

export const SideNavLinkItem = withRouter(props => {
  const active = props.location.pathname.startsWith(props.to)

  const renderLink = props => {
    return (
      <SidenavLink active={active} to={props.to}>
        {props.children}
      </SidenavLink>
    )
  }

  return (
    <SideNavItem>
      {props.tooltip ? (
        <SideNavTooltip title={props.tooltip}>
          {renderLink(props)}
        </SideNavTooltip>
      ) : (
        renderLink(props)
      )}
    </SideNavItem>
  )
})

SideNavLinkItem.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
  tooltip: PropTypes.string
}
