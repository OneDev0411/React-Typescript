import { addNotification as notify } from 'components/notification'

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

async function handleDelete({ deal, file, task }) {
  try {
    await store.dispatch(
      asyncDeleteFile({
        dealId: deal.id,
        fileId: file.id,
        taskId: task ? task.id : null
      })
    )

    store.dispatch(
      notify({
        message: 'File deleted',
        status: 'success'
      })
    )
  } catch (e) {
    console.log(e)
  }
}
