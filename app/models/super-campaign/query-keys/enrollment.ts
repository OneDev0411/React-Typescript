import { QueryKey } from 'react-query'

const TYPE = 'super_campaign_enrollment'

export function all(): QueryKey {
  return [TYPE]
}

export function lists(): QueryKey {
  return [...all(), 'list']
}

export function list(
  superCampaignId: UUID,
  includeCampaign?: boolean
): QueryKey {
  if (includeCampaign === undefined) {
    return [...lists(), superCampaignId]
  }

  return [...lists(), superCampaignId, { includeCampaign }]
}

export function details(): QueryKey {
  return [...all(), 'detail']
}

export function detail(id: UUID): QueryKey {
  return [...details(), id]
}
