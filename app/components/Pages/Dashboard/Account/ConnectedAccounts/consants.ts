import { OAuthProvider } from 'constants/contacts'

export const oAuthAccountTypeToTitle: StringMap<string> = {
  microsoft_credential: 'Outlook',
  google_credential: 'Google'
}
export const oAuthAccountTypeToProvider: StringMap<OAuthProvider> = {
  microsoft_credential: OAuthProvider.Outlook,
  google_credential: OAuthProvider.Google
}
