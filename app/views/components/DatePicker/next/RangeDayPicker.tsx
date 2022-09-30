import { useEffect, useState } from 'react'

import {
  DateRange,
  DayPicker,
  DayPickerDefaultProps,
  DayPickerRangeProps
} from 'react-day-picker-next'

import 'react-day-picker-next/dist/style.css'
import { Container } from './styled'

type Props = {
  defaultValue?: DateRange
  onSelect: (range: DateRange) => void
} & (DayPickerDefaultProps | DayPickerRangeProps)

export function RangeDayPicker({
  defaultValue,
  onSelect,
  ...dayPickerProps
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>(defaultValue)

  const handleSelectDate = (range: DateRange | undefined) => {
    if (!range) {
      return
    }

    setRange(range)
    onSelect(range)
  }

  useEffect(() => {
    setRange(defaultValue)
  }, [defaultValue])

  return (
    <Container>
      <DayPicker
        mode="range"
        {...dayPickerProps}
        selected={range}
        onSelect={handleSelectDate}
      />
    </Container>
  )
}
