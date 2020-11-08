import agent from 'superagent'

import config from 'config'

/**
 * returns form size in bytes
 */
export async function getPdfSize(data) {
  try {
    const response = await agent
      .post(`${config.proxy.url}/api/pdf/get-size`)
      .send(data)

    return response.body.total
  } catch (e) {
    console.log(e)

    return 0
  }
}
