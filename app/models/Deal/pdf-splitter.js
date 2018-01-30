import agent from 'superagent'

/**
 * split files
 */
export async function splitPDF(title, task_id, room_id, files, pages) {
  try {
    const request = agent
      .post('/api/deals/pdf-splitter')
      .field({ pages: JSON.stringify(pages) })
      .field({ title })
      .field({ room_id })
      .field({ task_id })

    files.forEach(file => {
      request.attach(file.id, file, `${file.id}.pdf`)
    })

    // send request
    const response = await request

    return response.body
  } catch (e) {
    throw e
  }
}

export default {
  splitPDF
}
