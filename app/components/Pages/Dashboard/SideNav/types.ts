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

export interface BaseAccordionMenu {
  access?: Access | Access[]
  action?: () => void
  id: string
  isHidden?: boolean
  label: string
  notificationCount?: Nullable<number>
  to?: string
}

export interface AccordionMenu extends BaseAccordionMenu {
  hasChildrenNotification?: boolean
  hasDivider?: boolean
  icon?: string
  subMenu?: BaseAccordionMenu[]
  testId?: string
}
