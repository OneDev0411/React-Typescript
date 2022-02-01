import { ReactNode, useEffect } from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { SidenavBlankLink, SidenavLink } from '../styled'
import { ExpandedMenu } from '../variables'

interface Props {
  children: ReactNode
  to: any
  tourId: any
  onClick: (panel: ExpandedMenu) => void
  target?: string
  rel?: string
}

function SideNavLinkSummary(props: Props & WithRouterProps) {
  const {
    children,
    location,
    onClick,
    to,
    tourId,
    target = '_self',
    rel = ''
  } = props

  const hasSubmenu = typeof to === 'object'

  const active =
    hasSubmenu &&
    to.findIndex((route: string) => location.pathname.startsWith(route)) !== -1

  useEffect(() => {
    active && onClick(tourId)
  }, [active, onClick, tourId])

  return typeof to === 'string' ? (
    <SidenavLink
      active={active && !hasSubmenu}
      to={hasSubmenu ? '' : to}
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
  )
}

export default withRouter(SideNavLinkSummary)
