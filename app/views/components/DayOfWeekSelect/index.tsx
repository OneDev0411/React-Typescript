import React from 'react'

import Select, { SelectProps } from 'components/Select'

import { daysOfWeekOptions } from './constants'

type DayOfWeekSelectProps = Omit<SelectProps<Weekday>, 'options'>

function DayOfWeekSelect(props: DayOfWeekSelectProps) {
  return <Select<Weekday> {...props} options={daysOfWeekOptions} />
}

export default DayOfWeekSelect
