import { Access } from 'components/Acl/types'

export type ExpandedMenu =
  | null
  | 'nav-dashboard'
  | 'nav-marketing'
  | 'nav-properties'
  | 'nav-people'
  | 'nav-chat'
  | 'nav-transaction'
  | 'nav-notifications'
  | 'nav-help-center'
  | 'nav-support'

export interface AccordionMenu {
  action?: () => void
  testId?: string
  id: string
  label: string
  access: Access | Access[]
  icon?: string
  hasChildrenNotification?: boolean
  notificationCount?: number | null
  to?: string
  hasDivider?: boolean
  subMenu?: AccordionSubMenu[]
  isHidden?: boolean
}

export interface AccordionSubMenu {
  access: Access | Access[]
  action?: () => void
  id: string
  label: string
  isHidden?: boolean
  notificationCount?: number | null
  to?: string
}
