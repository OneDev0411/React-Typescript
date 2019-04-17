import { addNotification as notify } from 'reapop'

import { renameTaskFile } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import store from '../../../../../../../../../stores'

export async function renameFile(props) {
  store.dispatch(
    confirmation({
      message: 'Enter New Name...',
      confirmLabel: 'Update',
      needsUserEntry: true,
      multilineEntry: false,
      inputDefaultValue: props.document.name,
      onConfirm: filename => handleRenameFile(props, filename)
    })
  )
}

function handleRenameFile(props, filename) {
  if (filename.trim().length === 0) {
    return store.dispatch(
      notify({
        title: 'Invalid file name',
        status: 'error'
      })
    )
  }

  const extension = props.document.name.split('.').pop()

  const newFilename = filename.endsWith(extension)
    ? filename
    : `${filename}.${extension}`

  try {
    return store.dispatch(
      renameTaskFile(props.task.id, props.document.id, newFilename)
    )
  } catch (e) {
    store.dispatch(
      props.notify({
        title: 'Could not rename the file',
        status: 'error'
      })
    )
  }
}
