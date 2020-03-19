import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import { SideNavItem, SidenavLink } from '../styled'

const renderLink = props => {
  return (
    <SidenavLink active={props.active} to={props.to}>
      {props.children}
    </SidenavLink>
  )
}

export const SideNavLinkItem = withRouter(props => {
  const active = props.location.pathname.startsWith(props.to)

  return <SideNavItem>{renderLink({ ...props, active })}</SideNavItem>
})

SideNavLinkItem.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
  tooltip: PropTypes.string
}
