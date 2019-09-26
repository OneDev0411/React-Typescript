import { OAuthProvider } from 'constants/contacts'

export function getEmailProvider(
  email: IEmailThreadEmail
): OAuthProvider | undefined {
  switch (email.origin) {
    case 'outlook':
      return OAuthProvider.Outlook
    case 'gmail':
      return OAuthProvider.Google
  }
}
