import { isEmailQueued } from './is-email-queued'

export function isEmailInProgress(item: IEmailCampaign<'template'>) {
  return !item.executed_at && !isEmailQueued(item)
}
