import { MenuBadge } from '@app/views/components/MenuBadge'

import { SideNavItemLabel } from '../styled'
import { AccordionSubMenu, ExpandedMenu } from '../types'

import SideNavLinkItem from './SideNavLinkItem'

interface Props {
  isOpen: boolean
  item: AccordionSubMenu
}

export function SideNavAccordionDetailsItem({ isOpen, item }: Props) {
  return (
    <SideNavLinkItem
      onTriggerAction={item.action}
      to={item.to}
      tourId={`nav-${item.id}` as ExpandedMenu}
      isSubmenu
    >
      <MenuBadge badgeContent={item.notificationCount} color="primary" max={9}>
        {isOpen ? (
          item.label
        ) : (
          <SideNavItemLabel>{item.label}</SideNavItemLabel>
        )}
      </MenuBadge>
    </SideNavLinkItem>
  )
}
