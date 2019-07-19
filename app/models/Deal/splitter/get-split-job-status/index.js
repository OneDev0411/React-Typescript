import agent from 'superagent'

import config from '../../../../../config/public'

/**
 * split files
 */
export async function getSplitJobStatus(user, jobId) {
  try {
    const response = await agent
      .get(`${config.splitter.url}/job-status/${jobId}`)
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
