import agent from 'superagent'

/**
 * split files
 */
export async function splitPDF(title, task_id, room_id, files, pages) {
  try {
    const response = await agent.post('/api/deals/pdf-splitter').send({
      pages,
      files,
      title,
      room_id,
      task_id
    })

    const body = JSON.parse(response.text)

    if (body.success) {
      return body
    }

    throw new Error(body.error)
  } catch (e) {
    throw e
  }
}

export default {
  splitPDF
}
