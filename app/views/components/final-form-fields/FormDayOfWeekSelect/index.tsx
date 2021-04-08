import React from 'react'

import { daysOfWeekOptions } from 'components/DayOfWeekSelect/constants'

import FormSelect, { FormSelectProps } from '../FormSelect'

type FormDayOfWeekSelectProps = Omit<FormSelectProps<IDayOfWeek>, 'options'>

function FormDayOfWeekSelect(props: FormDayOfWeekSelectProps) {
  return <FormSelect<IDayOfWeek> {...props} options={daysOfWeekOptions} />
}

export default FormDayOfWeekSelect
