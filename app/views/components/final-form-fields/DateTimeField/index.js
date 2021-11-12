import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { DateTimePicker } from '../../DateTimePicker'

DateTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  datePickerModifiers: PropTypes.shape(),
  showTimePicker: PropTypes.bool,
  children: PropTypes.node
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
  showTimePicker,
  children
}) {
  return (
    <Field
      name={name}
      render={fieldProps => (
        <DateTimePicker
          onChange={fieldProps.input.onChange}
          selectedDate={fieldProps.input.value ?? selectedDate}
          showTimePicker={showTimePicker}
          defaultlSelectedDate={fieldProps.input.value ?? selectedDate}
          datePickerModifiers={datePickerModifiers}
        >
          {children}
        </DateTimePicker>
      )}
    />
  )
}
