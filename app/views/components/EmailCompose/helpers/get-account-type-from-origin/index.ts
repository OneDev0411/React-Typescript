import { OAuthProvider } from 'constants/contacts'

export function getAccountTypeFromOrigin(
  origin: IEmailThreadEmail['origin']
): OAuthProvider | null /* null is intentionally used instead of undefined */ {
  switch (origin) {
    case 'gmail':
      return OAuthProvider.Google
    case 'outlook':
      return OAuthProvider.Outlook
    case 'rechat_email':
      return null
  }
}
