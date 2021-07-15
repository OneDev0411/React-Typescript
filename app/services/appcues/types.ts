export interface AppcuesUserInfo {
  id: string
  firstName: string | null
  fullName: string
  email: string
  userType: TUserType
  createdAt: number
}

export interface Location {
  pathname: string
}
