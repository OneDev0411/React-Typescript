import { ReactNode, useEffect } from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { SidenavLink } from '../styled'
import { ExpandedMenu } from '../variables'

interface Props {
  children: ReactNode
  to: string[]
  tourId: any
  onClick: (panel: ExpandedMenu) => void
}

function SideNavLinkSummary(props: Props & WithRouterProps) {
  const { children, location, onClick, to, tourId } = props
  const active =
    to.findIndex((route: string) => location.pathname.startsWith(route)) !== -1

  useEffect(() => {
    active && onClick(tourId)
  }, [active, onClick, tourId])

  const hasSubmenu = to.length > 1

  return (
    <SidenavLink
      active={active && !hasSubmenu}
      to={hasSubmenu ? '' : to[0]}
      data-tour-id={tourId}
    >
      {children}
    </SidenavLink>
  )
}

export default withRouter(SideNavLinkSummary)
