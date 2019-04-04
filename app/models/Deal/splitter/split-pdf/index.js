import agent from 'superagent'

import config from '../../../../../config/public'

/**
 * split files
 */
export async function splitPDF(user, title, task_id, files, pages) {
  try {
    const response = await agent
      .post(`${config.splitter.url}/split`)
      .send({
        pages,
        files,
        title,
        task_id
      })
      .set({
        api_url: config.api_url,
        access_token: user.access_token
      })

    return response.body
  } catch (e) {
    console.log(e)
    throw e
  }
}
