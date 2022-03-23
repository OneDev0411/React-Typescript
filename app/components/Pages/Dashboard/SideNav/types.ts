import { Access } from 'components/Acl/types'

export type ExpandedMenu =
  | null
  | 'nav-chat'
  | 'nav-dashboard'
  | 'nav-help-center'
  | 'nav-marketing'
  | 'nav-notifications'
  | 'nav-properties'
  | 'nav-people'
  | 'nav-support'
  | 'nav-transaction'

export interface AccordionMenu {
  access?: Access | Access[]
  action?: () => void
  hasChildrenNotification?: boolean
  hasDivider?: boolean
  icon?: string
  id: string
  isHidden?: boolean
  label: string
  notificationCount?: number | null
  subMenu?: AccordionSubMenu[]
  testId?: string
  to?: string
}

export interface AccordionSubMenu {
  access?: Access | Access[]
  action?: () => void
  id: string
  isHidden?: boolean
  label: string
  notificationCount?: number | null
  to?: string
}
