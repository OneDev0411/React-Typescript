import React from 'react'
import { Field } from 'react-final-form'

import { DateTimePicker } from '../../../../../../components/final-form-fields/DateTimePicker'

export class DueDate extends React.Component {
  render() {
    return (
      <Field
        name="dueDate"
        render={fieldProps => (
          <DateTimePicker
            onChange={fieldProps.input.onChange}
            defaultSelectedDate={this.props.selectedDate}
          />
        )}
      />
    )
  }
}
