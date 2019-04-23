import { addNotification as notify } from 'reapop'

import { asyncDeleteFile } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import store from '../../../../../../../../../stores'

export async function deleteFile(props) {
  store.dispatch(
    confirmation({
      message: 'Are you sure you want delete this file?',
      confirmLabel: 'Yes, Delete',
      onConfirm: () => handleDelete(props)
    })
  )
}

async function handleDelete({ deal, document, task }) {
  try {
    await store.dispatch(
      asyncDeleteFile({
        dealId: deal.id,
        fileId: document.id,
        taskId: task ? task.id : null
      })
    )

    store.dispatch(
      notify({
        title: 'File deleted',
        status: 'success'
      })
    )
  } catch (e) {
    console.log(e)
  }
}