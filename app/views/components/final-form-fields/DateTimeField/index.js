import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { DateTimePicker } from '../../DateTimePicker'

DateTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  datePickerModifiers: PropTypes.shape(),
  showTimePicker: PropTypes.bool,
  children: PropTypes.func
}

DateTimeField.defaultProps = {
  datePickerModifiers: {},
  showTimePicker: true
}

export function DateTimeField({
  name,
  datePickerModifiers,
  showTimePicker,
  children
}) {
  return (
    <Field
      name={name}
      render={fieldProps => {
        const hasFormValue = !!fieldProps.input.value
        // TODO: The DateTimePicker component does not support the initial state with no selected date.
        // I didn't have the time to fix that but we need to refactor the component to make it happen.
        const selectedDate = hasFormValue ? fieldProps.input.value : new Date()

        return (
          <DateTimePicker
            onChange={fieldProps.input.onChange}
            selectedDate={selectedDate}
            showTimePicker={showTimePicker}
            defaultlSelectedDate={selectedDate}
            datePickerModifiers={datePickerModifiers}
          >
            {children
              ? ({ rowDate, formattedDate, ...args }) =>
                  children({
                    ...args,
                    rowDate: hasFormValue ? rowDate : null,
                    formattedDate: hasFormValue ? formattedDate : null
                  })
              : undefined}
          </DateTimePicker>
        )
      }}
    />
  )
}
