import agent from 'superagent'

/**
 * returns form size in bytes
 */
export async function getPdfSize(data) {
  try {
    const response = await agent.post('/api/pdf/get-size').send(data)

    return response.body.total
  } catch (e) {
    console.log(e)

    return 0
  }
}
