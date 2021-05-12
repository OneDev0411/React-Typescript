import React, { ReactNode } from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { SideNavItem, SidenavLink } from '../styled'

interface Props {
  children: ReactNode
  to: string
  tourId?: string
}

function SideNavLinkItem(props: Props & WithRouterProps) {
  const active = props.location.pathname.startsWith(props.to)

  return (
    <SideNavItem>
      <SidenavLink active={active} to={props.to} data-tour-id={props.tourId}>
        {props.children}
      </SidenavLink>
    </SideNavItem>
  )
}

export default withRouter(SideNavLinkItem)
