import superagent from 'superagent'

import type { Neighborhood, NeighborhoodsReport } from './types'

const API_URL = '/api/liveby'
const REQUEST_TIMEOUT_MS = 60000

export async function getNeighborhoods(
  text: string,
  limit: number = 50,
  offset: number = 0
): Promise<Neighborhood[]> {
  const response = await superagent
    .post(`${API_URL}/neighborhoods`)
    .timeout(REQUEST_TIMEOUT_MS)
    .send({ text, limit, offset })

  return response.body
}

export async function getReport(
  neighborhood: string
): Promise<NeighborhoodsReport> {
  const response = await superagent
    .post(`${API_URL}/report`)
    .timeout(REQUEST_TIMEOUT_MS)
    .send({ neighborhood })

  return response.body.data
}
