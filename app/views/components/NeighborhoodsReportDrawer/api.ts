import superagent from 'superagent'

import { Neighborhood, NeighborhoodsReport } from './types'

const API_URL = '/api/liveby'

export async function getNeighborhoods(
  text: string,
  limit: number = 50,
  offset: number = 0
): Promise<Neighborhood[]> {
  const response = await superagent
    .post(`${API_URL}/neighborhoods`)
    .send({ text, limit, offset })

  return response.body
}

export async function getReport(
  neighborhood: string
): Promise<NeighborhoodsReport> {
  const response = await superagent
    .post(`${API_URL}/report`)
    .send({ neighborhood })

  return response.body.data
}
