import { Access } from 'components/Acl/types'

export interface AccessButtonType {
  access?: Access | Access[]
  action?: () => void
  icon?: string
  id: string
  label: string
  to?: string
}
