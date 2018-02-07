import agent from 'superagent'
import _ from 'underscore'

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

    const serverFiles = []

    files.forEach(file => {
      if (file.object instanceof File) {
        request.attach(file.id, file.object, `${file.id}.pdf`)
      } else {
        serverFiles.push(file)
      }
    })

    if (serverFiles.length > 0) {
      request.field({ files: JSON.stringify(_.indexBy(files, 'documentId')) })
    }

    // send request
    const response = await request

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
