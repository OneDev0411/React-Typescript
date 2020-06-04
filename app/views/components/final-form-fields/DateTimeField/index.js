import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { DateTimePicker } from '../../DateTimePicker'

DateTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  datePickerModifiers: PropTypes.shape(),
  showTimePicker: PropTypes.bool
}

DateTimeField.defaultProps = {
  selectedDate: new Date(),
  datePickerModifiers: {},
  showTimePicker: true
}

export function DateTimeField({
  name,
  selectedDate,
  datePickerModifiers,
  showTimePicker
}) {
  return (
    <Field
      name={name}
      render={fieldProps => (
        <DateTimePicker
          onChange={fieldProps.input.onChange}
          selectedDate={selectedDate}
          showTimePicker={showTimePicker}
          datePickerModifiers={datePickerModifiers}
        />
      )}
    />
  )
}
