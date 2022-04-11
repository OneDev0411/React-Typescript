import { useContext, useEffect, ReactNode } from 'react'

import { Theme, useMediaQuery } from '@material-ui/core'
import { withRouter, WithRouterProps } from 'react-router'

import { SideNavContext } from '../../DashboardLayout'
import { SidenavLink, SidenavLinkSummary } from '../styled'
import { BaseAccordionMenu, ExpandedMenu } from '../types'

interface Props {
  children: ReactNode
  isSubmenu?: boolean
  onExpandMenu?: (panel: ExpandedMenu) => void
  onTriggerAction?: () => void
  subMenu?: BaseAccordionMenu[]
  to?: string
  tourId: ExpandedMenu
}

function SideNavLinkItem(props: Props & WithRouterProps) {
  const {
    children,
    isSubmenu = false,
    location,
    onExpandMenu,
    onTriggerAction,
    subMenu,
    to = '',
    tourId
  } = props

  const { onDrawerToggle } = useContext(SideNavContext)

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const active = subMenu
    ? subMenu
        .map(item => item.to)
        .some((route: string) => location.pathname.startsWith(route))
    : !onTriggerAction && location.pathname.startsWith(to)

  // Here we check if the current route is active and there is a
  // related item in the menu, then expand that menu
  useEffect(() => {
    if (!active || !onExpandMenu) {
      return
    }

    onExpandMenu(tourId)
  }, [active, onExpandMenu, tourId])

  return isSubmenu ? (
    <SidenavLink
      active={active}
      data-tour-id={tourId}
      onClick={() => {
        onTriggerAction && onTriggerAction()
        // In mobile size if the menu should open the link, and hide the SideNav
        isMobile && onDrawerToggle()
      }}
      to={to}
    >
      {children}
    </SidenavLink>
  ) : (
    <SidenavLinkSummary
      active={active && !subMenu}
      data-tour-id={tourId}
      onClick={() => {
        onTriggerAction && onTriggerAction()
        // In mobile size if the menu has the default link,
        // should open the link, and hide the SideNav,
        // else should expand to show sub-menu items
        isMobile && to && onDrawerToggle()
      }}
      to={to}
    >
      {children}
    </SidenavLinkSummary>
  )
}

export default withRouter(SideNavLinkItem)
