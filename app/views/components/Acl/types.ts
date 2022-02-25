export type Access =
  | IPermission
  | ((team: IUserTeam) => boolean)
  | { oneOf: Access[] }
