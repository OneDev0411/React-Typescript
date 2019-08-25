import * as PropTypes from 'prop-types'

import React from 'react'

import { withRouter } from 'react-router'

import { SideNavTooltip } from './Tooltip'
import { SideNavItem } from './SideNavItem'
import { SidenavLink } from '../styled'

export const SideNavLinkItem = withRouter(props => {
  const active = props.location.pathname.startsWith(props.to)

  const Icon = (active && props.ActiveIcon) || props.Icon

  return (
    <SideNavItem>
      <SideNavTooltip title={props.tooltip}>
        <SidenavLink inverse active={active} to={props.to}>
          <Icon style={{ pointerEvents: 'none' }} />
          {props.children || null}
        </SidenavLink>
      </SideNavTooltip>
    </SideNavItem>
  )
})

SideNavLinkItem.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  ActiveIcon: PropTypes.elementType.isRequired,
  tooltip: PropTypes.string
}
