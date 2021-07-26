import { confirmation } from 'actions/confirmation'
import { renameTaskFile } from 'actions/deals'
import { addNotification as notify } from 'components/notification'

import store from '../../../../../../../../../stores'

export async function renameFile(props) {
  store.dispatch(
    confirmation({
      message: 'Enter New Name...',
      confirmLabel: 'Update',
      needsUserEntry: true,
      multilineEntry: false,
      inputDefaultValue: props.file.name,
      onConfirm: filename => handleRenameFile(props, filename)
    })
  )
}

function handleRenameFile(props, filename) {
  if (filename.trim().length === 0) {
    return store.dispatch(
      notify({
        message: 'Invalid file name',
        status: 'error'
      })
    )
  }

  const extension = props.file.name.split('.').pop()

  const newFilename = filename.endsWith(extension)
    ? filename
    : `${filename}.${extension}`

  try {
    return store.dispatch(
      renameTaskFile(props.task.id, props.file.id, newFilename)
    )
  } catch (e) {
    store.dispatch(
      props.notify({
        message: 'Could not rename the file',
        status: 'error'
      })
    )
  }
}
