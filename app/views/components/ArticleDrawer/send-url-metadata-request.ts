import superagent from 'superagent'

import { Metadata } from './types'

interface Response {
  response?: Metadata
  error?: string
}

export async function sendUrlMetadataRequest(url: string): Promise<Response> {
  const response = await superagent
    .post('/api/utils/get-url-metadata')
    .send({ url })

  return response.body
}
