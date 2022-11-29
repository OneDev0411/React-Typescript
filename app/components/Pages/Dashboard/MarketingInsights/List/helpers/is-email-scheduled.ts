import { isEmailQueued } from './is-email-queued'

export function isEmailScheduled(item: IEmailCampaign<'template'>) {
  return !item.executed_at && isEmailQueued(item)
}
