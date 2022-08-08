import { useState } from 'react'

import moment from 'moment'

import DatePicker from '@app/views/components/DatePicker'

import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

interface Props {
  task: ITask
  closeHandler: () => void
}

export function InlineDueDateCell({ task, closeHandler }: Props) {
  const mutation = useTaskMutation(task)
  const [date, setDate] = useState(new Date(task.due_date * 1000))

  const handleSelectDate = (value: Date, type: string) => {
    const currentDueDate = moment.unix(task.due_date)

    value.setHours(currentDueDate.hours())
    value.setMinutes(currentDueDate.minutes())

    setDate(value)

    if (type === 'day') {
      closeHandler()

      mutation.mutate({
        due_date: new Date(value).getTime() / 1000
      })
    }
  }

  return <DatePicker selectedDate={date} onChange={handleSelectDate} />
}
