import React, { useState, useContext } from 'react'
import Checkbox from '@material-ui/core/Checkbox'

import { Tooltip } from '@material-ui/core'

import { updateTaskStatus } from 'models/tasks/update-task-status'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  event: ICalendarEvent
  onChange(event: IEvent, type: 'updated'): void
}

export function CrmStatus({ event, onChange }: Props) {
  const context = useContext(ConfirmationModalContext)
  const [isChecked, setIsChecked] = useState<boolean>(event.status === 'DONE')

  const dueDate = new Date(event.timestamp * 1000)
  const now = new Date()

  if (now > dueDate) {
    return null
  }

  const handleChange = async () => {
    const [newTaskStatus, shouldUpdate] = await new Promise(resolve => {
      context.setConfirmationModal({
        message: 'Heads up!',
        description:
          'If you mark this event as done, the event due date will change to now. Are you sure?',
        onConfirm: () => {
          return resolve(['DONE', true])
        },
        onCancel: () => {
          return resolve([null, false])
        }
      })
    })

    if (!shouldUpdate) {
      return
    }

    setIsChecked(!isChecked)

    const taskId =
      event.object_type === 'crm_association' ? event.crm_task : event.id

    try {
      const task: IEvent = await updateTaskStatus(taskId, newTaskStatus)

      onChange(task, 'updated')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Tooltip title="Mark As Done" placement="top">
      <Checkbox
        color="primary"
        disableRipple
        checked={isChecked}
        onClick={handleChange}
      />
    </Tooltip>
  )
}
