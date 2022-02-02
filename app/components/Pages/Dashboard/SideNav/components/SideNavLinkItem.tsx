import { ReactNode, useEffect } from 'react'

import { withRouter, WithRouterProps } from 'react-router'

import { SidenavLink, SidenavLinkSummary } from '../styled'
import { AccordionSubMenu, ExpandedMenu } from '../types'

interface Props {
  children: ReactNode
  isSubmenu?: boolean
  onExpandedMenu?: (panel: ExpandedMenu) => void
  onTriggerAction?: () => void
  subMenu?: AccordionSubMenu[]
  to?: string
  tourId: ExpandedMenu
}

function SideNavLinkItem(props: Props & WithRouterProps) {
  const {
    children,
    isSubmenu = false,
    location,
    onExpandedMenu,
    onTriggerAction,
    subMenu,
    to = '',
    tourId
  } = props

  const active = subMenu
    ? subMenu
        .map(item => item.to)
        .some((route: string) => location.pathname.startsWith(route))
    : !onTriggerAction && location.pathname.startsWith(to)

  useEffect(() => {
    active && onExpandedMenu && onExpandedMenu(tourId)
  }, [active, onExpandedMenu, tourId])

  return isSubmenu ? (
    <SidenavLink
      active={active}
      to={to}
      onClick={onTriggerAction}
      data-tour-id={tourId}
    >
      {children}
    </SidenavLink>
  ) : (
    <SidenavLinkSummary
      active={active && !subMenu}
      to={to}
      onClick={onTriggerAction}
      data-tour-id={tourId}
    >
      {children}
    </SidenavLinkSummary>
  )
}

export default withRouter(SideNavLinkItem)
