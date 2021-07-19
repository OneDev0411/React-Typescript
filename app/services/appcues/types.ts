import { ACL } from '@app/constants/acl'

export interface AppcuesUserInfo {
  firstName: string | null
  fullName: string
  email: string
  userType: TUserType
  createdAt: number
}

export type AppcuesUserAccessList = Record<
  `has${typeof ACL[keyof typeof ACL]}Access`,
  boolean
>
