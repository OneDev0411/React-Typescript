import React from 'react'

import SelectField, { SelectFieldProps } from 'components/SelectField'

interface DayOfWeekSelectFieldProps
  extends Omit<SelectFieldProps<IDayOfWeek>, 'options'> {
  hideWeekendDays?: boolean
}

function DayOfWeekSelectField({
  hideWeekendDays = false,
  ...otherProps
}: DayOfWeekSelectFieldProps) {
  const weekDayOptions: SelectFieldProps<IDayOfWeek>['options'] = [
    {
      label: 'Monday',
      value: 'Monday'
    },
    {
      label: 'Tuesday',
      value: 'Tuesday'
    },
    {
      label: 'Wednesday',
      value: 'Wednesday'
    },
    {
      label: 'Thursday',
      value: 'Thursday'
    },
    {
      label: 'Friday',
      value: 'Friday'
    },
    !hideWeekendDays && {
      label: 'Saturday',
      value: 'Saturday'
    },
    !hideWeekendDays && {
      label: 'Sunday',
      value: 'Sunday'
    }
  ]

  return <SelectField<IDayOfWeek> {...otherProps} options={weekDayOptions} />
}

export default DayOfWeekSelectField
