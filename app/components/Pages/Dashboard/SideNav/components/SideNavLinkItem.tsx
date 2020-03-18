import React, { ReactNode } from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { SideNavItem, SidenavLink } from '../styled'

interface Props {
  children: ReactNode
  to: string
}

function SideNavLinkItem(props: Props & WithRouterProps) {
  const active = props.location.pathname.startsWith(props.to)

  return (
    <SideNavItem>
      <span style={{ display: 'inline-flex' }}>
        <SidenavLink active={active} to={props.to}>
          {props.children}
        </SidenavLink>
      </span>
    </SideNavItem>
  )
}

export default withRouter(SideNavLinkItem)
