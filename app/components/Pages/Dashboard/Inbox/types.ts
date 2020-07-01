import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

interface EmailThreadChangeEventBase {
  threads: UUID[]
}
interface GoogleEmailThreadChangeEvent extends EmailThreadChangeEventBase {
  [GOOGLE_CREDENTIAL]: UUID
}
interface MicrosoftEmailThreadChangeEvent extends EmailThreadChangeEventBase {
  [MICROSOFT_CREDENTIAL]: UUID
}

export type EmailThreadChangeEvent =
  | GoogleEmailThreadChangeEvent
  | MicrosoftEmailThreadChangeEvent
