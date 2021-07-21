import { confirmation } from 'actions/confirmation'
import { deleteTask as deleteTaskItem } from 'actions/deals'

import store from '../../../../../../../../../stores'
import { notifyOffice } from '../notify-office'

export async function deleteTask(props) {
  const isTaskRequired =
    props.task.required ||
    ['Approved', 'Declined'].includes(props.task?.review?.status)

  if (isTaskRequired && !props.isBackOffice) {
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
