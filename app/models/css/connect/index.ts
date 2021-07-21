import { Response } from 'superagent'

import Fetch from '../../../services/fetch'
import { API_PATH } from '../constants'
import { CSSInput, CSSData } from '../types'

export default async function connect(data: CSSInput): Promise<CSSData> {
  try {
    const response: Response = await new Fetch().post(API_PATH).send(data)

    return response.body
  } catch (err) {
    console.error(err)
    throw err
  }
}
