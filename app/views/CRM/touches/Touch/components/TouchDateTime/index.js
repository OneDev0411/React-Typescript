import React from 'react'

import { getTimes } from '../../../../../../utils/get-times'
import { DateTimeField } from '../../../../../components/final-form-fields/DateTimeField'

export function TouchDateTime(props) {
  return (
    <div>
      <DateTimeField
        name="touch"
        isRequired
        id="touch-timestamp"
        selectedDate={props.selectedDate}
        title="Date & Time"
        timeItems={getTimes()}
      />
    </div>
  )
}
