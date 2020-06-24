import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

export function getFromData(
  from: IUser | IOAuthAccount,
  defaultValue: string = ''
): {
  from: UUID
  [GOOGLE_CREDENTIAL]?: string
  [MICROSOFT_CREDENTIAL]?: string
} {
  const id = from.id

  switch (from.type) {
    case GOOGLE_CREDENTIAL:
      return {
        from: defaultValue,
        [GOOGLE_CREDENTIAL]: id
      }

    case MICROSOFT_CREDENTIAL:
      return {
        from: defaultValue,
        [MICROSOFT_CREDENTIAL]: id
      }

    default:
      return {
        from: id
      }
  }
}
