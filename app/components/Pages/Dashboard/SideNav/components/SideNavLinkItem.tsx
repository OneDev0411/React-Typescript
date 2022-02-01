import React, { ReactNode } from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { SideNavItem, SidenavLink, SidenavBlankLink } from '../styled'

interface Props {
  children: ReactNode
  to: any
  tourId?: string
  target?: string
  rel?: string
}

function SideNavLinkItem(props: Props & WithRouterProps) {
  const { target = '_self', rel = '', to, location, children, tourId } = props
  const active = location.pathname.startsWith(to)

  return (
    <SideNavItem>
      {typeof to === 'string' ? (
        <SidenavLink
          active={active}
          to={to}
          data-tour-id={tourId}
          target={target}
          rel={rel}
        >
          {children}
        </SidenavLink>
      ) : (
        <SidenavBlankLink onClick={to} data-tour-id={tourId}>
          {children}
        </SidenavBlankLink>
      )}
    </SideNavItem>
  )
}

export default withRouter(SideNavLinkItem)
