import { IUserState } from '@app/reducers/user'

export type AccountInfo = {
  team: IUserTeam
  user: IUserState
}

export type Access =
  | IPermission
  | ((accountInfo: AccountInfo) => boolean)
  | { oneOf: Access[] }
