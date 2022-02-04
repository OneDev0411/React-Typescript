export interface AppcuesUserInfo {
  firstName: string | null
  fullName: string
  email: string
  userType: TUserType
  createdAt: number
}

export type AppcuesUserAccessList = Record<`has${IPermission}Access`, boolean>
export type AppcuesBrandsList = Record<string, UUID>
