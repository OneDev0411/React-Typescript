import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

export function hasPixelTracking(campaign: IEmailCampaign): boolean {
  return !!campaign[GOOGLE_CREDENTIAL] || !!campaign[MICROSOFT_CREDENTIAL]
}
