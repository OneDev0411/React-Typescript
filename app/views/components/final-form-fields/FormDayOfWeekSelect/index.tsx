import React from 'react'

import { daysOfWeekOptions } from 'components/DayOfWeekSelect/constants'

import FormSelect, { FormSelectProps } from '../FormSelect'

type FormDayOfWeekSelectProps = Omit<FormSelectProps<Weekday>, 'options'>

function FormDayOfWeekSelect(props: FormDayOfWeekSelectProps) {
  return <FormSelect<Weekday> {...props} options={daysOfWeekOptions} />
}

export default FormDayOfWeekSelect
