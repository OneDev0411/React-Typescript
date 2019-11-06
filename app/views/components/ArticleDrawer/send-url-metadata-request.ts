import superagent from 'superagent'

import { Metadata } from './types'

const API_URL = '/api/get-url-metadata/getUrlMetadata'

interface Response {
  response?: Metadata
  error?: string
}

export async function sendUrlMetadataRequest(url: string): Promise<Response> {
  const response = await superagent.post(API_URL).send({ url })

  return response.body
}
