import React from 'react'
import { Field } from 'react-final-form'

// import { getTime } from '../../../../../../../utils/get-time'
// import { getTimes } from '../../../../../../../utils/get-times'
// import { todayDate } from '../../../../../../../utils/today-date'

import { DateTimePicker } from '../../../../../../components/final-form-fields/DateTimePicker'

// const today = todayDate()

export default function DueDate({ selectedDate }) {
  // const timeItems = getTimes().filter(
  //   time =>
  //     selectedDate.value !== today || time.value > getTime(new Date() || time)
  // )

  return (
    <Field
      name="dueDate"
      render={({ input }) => (
        <DateTimePicker
          onChange={date => {
            // console.log(date)
            input.onChange(date)
          }}
          defaultSelectedDate={selectedDate}
        />
      )}
    />
  )
}
