import React from 'react'
import fecha from 'fecha'

import { getTime } from '../../../../../../utils/get-time'
import { getTimes } from '../../../../../../utils/get-times'
import { DateTimeField } from '../../../../../components/final-form-fields/DateTimeField'

export function TouchDateTime(props) {
  let timeItems = getTimes()

  if (props.selectedDate.title === fecha.format(new Date(), 'MM/DD/YYYY')) {
    timeItems = timeItems.filter(time => time.value < getTime(new Date()))
  }

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
