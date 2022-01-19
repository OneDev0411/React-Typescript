import { QueryKey } from 'react-query'

const TYPE = 'super_campaign_enrollment'

export function all(): QueryKey {
  return [TYPE]
}

export function lists(): QueryKey {
  return [...all(), 'list']
}

export function allList(
  superCampaignId: UUID,
  includeCampaign?: boolean
): QueryKey {
  if (includeCampaign === undefined) {
    return [...lists(), 'all', superCampaignId]
  }

  return [...lists(), 'all', superCampaignId, { includeCampaign }]
}

export function details(): QueryKey {
  return [...all(), 'detail']
}

export function detail(id: UUID): QueryKey {
  return [...details(), id]
}

export function myList(): QueryKey {
  return [...lists(), 'my']
}
