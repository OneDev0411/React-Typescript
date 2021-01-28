import { SuperAgentRequest } from 'superagent'

import Fetch from '../../services/fetch'

export function deleteBrandAsset(
  brandId: UUID,
  assetId: UUID
): SuperAgentRequest {
  return new Fetch().delete(`/brands/${brandId}/assets/${assetId}`)
}
