import { useState } from 'react'

import DatePicker from '@app/views/components/DatePicker'

interface Props {
  defaultValue: number
  closeHandler: () => void
}

export function InlineDueDateCell({ defaultValue, closeHandler }: Props) {
  const [date, setDate] = useState(new Date(defaultValue * 1000))

  const handleSelectDate = (value: Date, type: string) => {
    setDate(value)

    if (type === 'day') {
      closeHandler()
    }
  }

  return (
    <>
      <DatePicker selectedDate={date} onChange={handleSelectDate} />
    </>
  )
}
