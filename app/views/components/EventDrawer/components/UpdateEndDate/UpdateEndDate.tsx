import React from 'react'

import { WhenFieldChanges } from 'components/final-form-fields'

interface Props {
  dueDate: Date
  endDate: Date | null
}

export default function UpdateEndDate({ dueDate, endDate }: Props) {
  if (endDate == null) {
    return null
  }

  return (
    <WhenFieldChanges
      set="endDate"
      watch="dueDate"
      setter={onChange => {
        const newDate = new Date(endDate)

        newDate.setDate(dueDate.getDate())
        newDate.setMonth(dueDate.getMonth())
        newDate.setFullYear(dueDate.getFullYear())

        onChange(newDate)
      }}
    />
  )
}
