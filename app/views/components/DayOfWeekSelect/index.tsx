import React from 'react'

import Select, { SelectProps } from 'components/Select'

import { daysOfWeekOptions } from './constants'

type DayOfWeekSelectProps = Omit<SelectProps<IDayOfWeek>, 'options'>

function DayOfWeekSelect(props: DayOfWeekSelectProps) {
  return <Select<IDayOfWeek> {...props} options={daysOfWeekOptions} />
}

export default DayOfWeekSelect
