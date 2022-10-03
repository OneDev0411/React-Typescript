import { useState } from 'react'

import {
  DayPicker,
  DayPickerDefaultProps,
  DayPickerSingleProps
} from 'react-day-picker-next'

import 'react-day-picker-next/dist/style.css'
import { Container } from './styled'

type Props = {
  defaultValue?: Date
  onSelect: (date: Date) => void
} & (DayPickerDefaultProps | DayPickerSingleProps)

export function SingleDatePicker({
  defaultValue,
  onSelect,
  ...dayPickerProps
}: Props) {
  const [selected, setSelected] = useState<Date>()

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) {
      return
    }

    setSelected(date)
    onSelect(date)
  }

  return (
    <Container>
      <DayPicker
        mode="single"
        {...dayPickerProps}
        selected={selected}
        onSelect={handleSelectDate}
      />
    </Container>
  )
}
