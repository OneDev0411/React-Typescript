import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { DateTimePicker } from '../../DateTimePicker'

DateTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  datePickerModifiers: PropTypes.shape()
}

DateTimeField.defaultProps = {
  selectedDate: new Date(),
  datePickerModifiers: {}
}

export function DateTimeField(props) {
  return (
    <Field
      name={props.name}
      render={fieldProps => (
        <DateTimePicker
          onChange={fieldProps.input.onChange}
          selectedDate={props.selectedDate}
          datePickerModifiers={props.datePickerModifiers}
        />
      )}
    />
  )
}
