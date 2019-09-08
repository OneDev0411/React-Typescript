import React, { useState, useContext } from 'react'
import Checkbox from '@material-ui/core/Checkbox'

import { updateTask } from 'models/tasks/update-task'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

interface Props {
  event: ICalendarEvent
  onChange(event: IEvent, type: 'updated'): void
}

export function CrmStatus({ event, onChange }: Props) {
  const context = useContext(ConfirmationModalContext)

  const [isChecked, setIsChecked] = useState<boolean>(event.status === 'DONE')

  const handleChange = async () => {
    const [shouldUpdate, newTask] = await new Promise(resolve => {
      // Change task due date to now if user is marking it as done
      // const dueDate = new Date(event.timestamp * 1000)
      const now = new Date()

      // if (dueDate <= now || event.status === 'DONE') {
      //   return resolve([
      //     true,
      //     {
      //       task_type: event.event_type,
      //       title: event.title,
      //       due_date: event.timestamp,
      //       status: event.status === 'DONE' ? 'PENDING' : 'DONE'
      //     }
      //   ])
      // }

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
      const task = await updateTask(newTask)

      onChange(task, 'updated')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Checkbox
      color="primary"
      disableRipple
      checked={isChecked}
      onChange={handleChange}
      // used inline style for the sake of performance in Virtual List
      style={{
        padding: 0,
        margin: '-2px 0.5rem 0 -2px'
      }}
    />
  )
}
