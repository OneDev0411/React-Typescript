import { Response } from 'superagent'

import Fetch from '../../../services/fetch'

import { CSSData } from '../types'
import { API_PATH } from '../constants'

export default async function get(): Promise<CSSData> {
  try {
    const response: Response = await new Fetch().get(API_PATH)

    return response.body
  } catch (err) {
    console.error(err)
    throw err
  }
}
