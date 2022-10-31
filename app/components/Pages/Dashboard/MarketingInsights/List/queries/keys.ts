import { EmailCampaignStatus, SortingValue } from '../../types'

const TYPE = ['insights']

export function all() {
  return [TYPE]
}

export function allLists() {
  return [...all(), 'list']
}

export function list(
  status: EmailCampaignStatus,
  order: SortingValue = '-created_at'
) {
  return [...all(), 'list', { status, order }]
}
