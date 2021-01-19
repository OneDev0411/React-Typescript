export type Access =
  | IPermission
  | ((user: IUser) => boolean)
  | { oneOf: Access[] }

export interface UseAclOptions {
  accessControlPolicy?: IAccessControlPolicy
}
