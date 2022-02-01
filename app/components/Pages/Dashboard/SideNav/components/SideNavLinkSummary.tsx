import { ReactNode, useEffect } from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { SidenavBlankLink, SidenavLink } from '../styled'
import { ExpandedMenu } from '../variables'

interface Props {
  children: ReactNode
  to: any
  tourId: any
  onClick?: (panel: ExpandedMenu) => void
  target?: string
  rel?: string
  hasSubmenu?: any
}

function SideNavLinkSummary(props: Props & WithRouterProps) {
  const {
    children,
    location,
    onClick = () => {},
    to,
    tourId,
    target = '_self',
    rel = '',
    hasSubmenu
  } = props

  const active = hasSubmenu
    ? to.some((route: string) => location.pathname.startsWith(route))
    : location.pathname.startsWith(to)

  useEffect(() => {
    active && onClick(tourId)
  }, [active, onClick, tourId])

  return typeof to === 'function' ? (
    <SidenavBlankLink onClick={to} data-tour-id={tourId}>
      {children}
    </SidenavBlankLink>
  ) : (
    <SidenavLink
      active={active && !hasSubmenu}
      to={hasSubmenu ? '' : to}
      data-tour-id={tourId}
      target={target}
      rel={rel}
    >
      {children}
    </SidenavLink>
  )
}

export default withRouter(SideNavLinkSummary)
