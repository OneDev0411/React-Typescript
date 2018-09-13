import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { DateTimePicker } from '../../DateTimePicker'

DateTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date)
}

DateTimeField.defaultProps = {
  selectedDate: new Date()
}

export function DateTimeField(props) {
  return (
    <Field
      name={props.name}
      render={fieldProps => (
        <DateTimePicker
          onChange={fieldProps.input.onChange}
          defaultSelectedDate={props.selectedDate}
        />
      )}
    />
  )
}
