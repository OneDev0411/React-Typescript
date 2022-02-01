import { ReactNode, useEffect } from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { SidenavLink, SidenavLinkSummary } from '../styled'
import { ExpandedMenu } from '../variables'

interface Props {
  children: ReactNode
  to: any
  tourId: any
  onClick?: (panel: ExpandedMenu) => void
  hasSubmenu?: any
  isSubmenu?: boolean
}

function SideNavLinkItem(props: Props & WithRouterProps) {
  const {
    children,
    location,
    onClick = () => {},
    to,
    tourId,
    hasSubmenu,
    isSubmenu = false
  } = props

  const active = hasSubmenu
    ? to.some((route: string) => location.pathname.startsWith(route))
    : location.pathname.startsWith(to)

  useEffect(() => {
    active && onClick(tourId)
  }, [active, onClick, tourId])

  return isSubmenu ? (
    <SidenavLink
      active={active}
      to={typeof to === 'function' ? '' : to}
      onClick={typeof to === 'function' ? to : () => false}
      data-tour-id={tourId}
    >
      {children}
    </SidenavLink>
  ) : (
    <SidenavLinkSummary
      active={active && !hasSubmenu}
      to={typeof to === 'function' || hasSubmenu ? '' : to}
      onClick={typeof to === 'function' ? to : () => false}
      data-tour-id={tourId}
    >
      {children}
    </SidenavLinkSummary>
  )
}

export default withRouter(SideNavLinkItem)
