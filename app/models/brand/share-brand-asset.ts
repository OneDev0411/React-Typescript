import { Response } from 'superagent'

import Fetch from '@app/services/fetch'

export function shareBrandAsset(
  brandId: UUID,
  assetId: UUID,
  recipients: string[],
  text: string
): Promise<Response> {
  return new Fetch().post(`/brands/${brandId}/assets/${assetId}/share`).send({
    text,
    recipients
  })
}
