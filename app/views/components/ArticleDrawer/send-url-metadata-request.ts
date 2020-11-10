import superagent from 'superagent'

import config from 'config'

import { Metadata } from './types'

interface Response {
  response?: Metadata
  error?: string
}

export async function sendUrlMetadataRequest(url: string): Promise<Response> {
  const response = await superagent
    .post(`${config.app.url}/api/utils/get-url-metadata`)
    .send({ url })

  return response.body
}
