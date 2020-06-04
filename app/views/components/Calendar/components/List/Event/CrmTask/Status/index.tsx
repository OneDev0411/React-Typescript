import React, { useState, useContext } from 'react'
import Checkbox from '@material-ui/core/Checkbox'

import { Tooltip } from '@material-ui/core'

import { updateTask } from 'models/tasks/update-task'

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
    const [shouldUpdate, newTask] = await new Promise(resolve => {
      context.setConfirmationModal({
        message: 'Heads up!',
        description:
          'If you mark this event as done, the event due date will change to now. Are you sure?',
        onConfirm: () => {
          return resolve([
            true,
            {
              task_type: event.event_type,
              title: event.title,
              status: 'DONE',
              due_date: now.getTime() / 1000
            }
          ])
        },
        onCancel: () => {
          return resolve([false, null])
        }
      })
    })

    if (!shouldUpdate) {
      return
    }

    setIsChecked(!isChecked)

    newTask.id =
      event.object_type === 'crm_association' ? event.crm_task : event.id

    if (newTask.status === 'DONE') {
      newTask.reminders = []
    }

    try {
      const task: IEvent = await updateTask(newTask, {
        'associations[]': ['crm_task.associations', 'crm_association.contact']
      })

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
