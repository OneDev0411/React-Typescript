import { Response } from 'superagent'

import Fetch from '../../../services/fetch'

import { API_PATH } from '../constants'

export default async function disconnect(): Promise<Response> {
  try {
    const response: Response = await new Fetch().delete(API_PATH)

    return response.body
  } catch (err) {
    console.error(err)
    throw err
  }
}
