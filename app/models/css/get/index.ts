import { Response } from 'superagent'

import Fetch from '../../../services/fetch'
import { API_PATH } from '../constants'
import { CSSData } from '../types'

export default async function get(): Promise<CSSData> {
  try {
    const response: Response = await new Fetch().get(API_PATH)

    return response.body
  } catch (err) {
    console.error(err)
    throw err
  }
}
