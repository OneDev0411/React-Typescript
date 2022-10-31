import { EmailCampaignStatus } from '../../types'

const TYPE = ['insights']

export function all() {
  return [TYPE]
}

export function allLists() {
  return [...all(), 'list']
}

export function listStatus(status: EmailCampaignStatus) {
  return [...all(), 'list', { status }]
}
