import agent from 'superagent'
import { addNotification as notify } from 'reapop'
import store from '../../stores'

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
    if (e.status === 401) {
      store.dispatch(
        notify({
          status: 'error',
          message: 'You should login to be able split the pdf'
        })
      )

      setTimeout(() => (window.location.href = '/signout'), 2000)
    }

    throw e
  }
}

export default {
  splitPDF
}
