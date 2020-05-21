import { confirmation } from 'actions/confirmation'
import { deleteTask as deleteTaskItem } from 'actions/deals'

import { notifyOffice } from '../notify-office'
import store from '../../../../../../../../../stores'

export async function deleteTask(props) {
  if (props.task.required && !props.isBackOffice) {
    return store.dispatch(
      confirmation({
        message: 'Delete a required folder?',
        description: 'Only your back office can delete this folder.',
        confirmLabel: 'Notify Office',
        needsUserEntry: true,
        inputDefaultValue: 'Please remove from my folder.',
        onConfirm: comment => notifyOffice(props, comment)
      })
    )
  }

  store.dispatch(
    confirmation({
      message: 'Delete this folder?',
      description: 'You cannot undo this action',
      confirmLabel: 'Delete',
      confirmButtonColor: 'danger',
      onConfirm: () =>
        store.dispatch(deleteTaskItem(props.task.checklist, props.task.id))
    })
  )
}
