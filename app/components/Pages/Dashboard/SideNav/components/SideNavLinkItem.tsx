import React, { ReactNode } from 'react'
import { withRouter, WithRouterProps } from 'react-router'

import { SideNavItem, SidenavLink } from '../styled'

const IGNORE_PATHS = ['/dashboard/marketing-center-settings']

interface Props {
  children: ReactNode
  to: string
}

function SideNavLinkItem(props: Props & WithRouterProps) {
  const active =
    !IGNORE_PATHS.includes(props.location.pathname) &&
    props.location.pathname.startsWith(props.to)

  return (
    <SideNavItem>
      <SidenavLink active={active} to={props.to}>
        {props.children}
      </SidenavLink>
    </SideNavItem>
  )
}

export default withRouter(SideNavLinkItem)
