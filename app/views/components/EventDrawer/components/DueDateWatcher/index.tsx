import React from 'react'

import { FieldWatcher } from 'components/final-form-fields'

interface Props {
  dueDate: Date
  endDate: Nullable<Date>
}

export const DueDateWatcher = ({ dueDate, endDate }: Props) => {
  if (endDate == null) {
    return null
  }

  return (
    <FieldWatcher
      set="endDate"
      watch="dueDate"
      setter={onChange => {
        if (dueDate.getTime() >= endDate.getTime()) {
          // 1 hour after
          const newEndDate = new Date(dueDate.getTime() + 3600000)

          onChange(newEndDate)
        }
      }}
    />
  )
}
