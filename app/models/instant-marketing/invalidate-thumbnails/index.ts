import { Response } from 'superagent'

import Fetch from '../../../services/fetch'

export async function invalidateThumbnails(brand: UUID): Promise<Response> {
  return new Fetch().post(`/brands/${brand}/templates/thumbnails/invalidate`)
}
