import React from 'react'

import { getTime } from '../../../../../utils/get-time'
import { getTimes } from '../../../../../utils/get-times'
import { DateTimeField } from '../../../../components/final-form-fields/DateTimeField'

export function TouchDateTime(props) {
  const timeItems = getTimes().filter(
    time => time.value < getTime(new Date() || time)
  )

  return (
    <div>
      <DateTimeField
        name="touch"
        isRequired
        id="touch-timestamp"
        selectedDate={props.selectedDate}
        title="Date & Time"
        timeItems={timeItems}
        datePickerModifiers={{
          disabled: {
            after: new Date()
          }
        }}
      />
    </div>
  )
}
