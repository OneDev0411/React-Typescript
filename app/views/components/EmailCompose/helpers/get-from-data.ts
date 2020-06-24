import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

export function getFromData(
  from: IUser | IOAuthAccount,
  defaultValue: string = ''
) {
  const id = from.id
  const data: {
    from: UUID
    [GOOGLE_CREDENTIAL]?: string
    [MICROSOFT_CREDENTIAL]?: string
  } = {
    from: id,
    [GOOGLE_CREDENTIAL]: undefined,
    [MICROSOFT_CREDENTIAL]: undefined
  }

  switch (from.type) {
    case GOOGLE_CREDENTIAL:
      data.from = defaultValue
      data[GOOGLE_CREDENTIAL] = from.id
      break
    case MICROSOFT_CREDENTIAL:
      data.from = defaultValue
      data[MICROSOFT_CREDENTIAL] = from.id
      break
    default:
      break
  }

  return data
}
