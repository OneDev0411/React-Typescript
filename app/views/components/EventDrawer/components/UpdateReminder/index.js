import React from 'react'
import PropTypes from 'prop-types'

import { WhenFieldChanges } from 'components/final-form-fields'

import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'

UpdateReminder.propTypes = {
  dueDate: PropTypes.shape(new Date()).isRequired,
  defaultOption: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  })
}

UpdateReminder.defaultProps = {
  // 15 Minutes Before
  defaultOption: REMINDER_DROPDOWN_OPTIONS[3]
}

export function UpdateReminder({ dueDate, defaultOption }) {
  return (
    <WhenFieldChanges
      set="reminder"
      watch="dueDate"
      setter={onChange => {
        const items = REMINDER_DROPDOWN_OPTIONS.filter(
          ({ value }) =>
            value == null ||
            value <= new Date(dueDate).getTime() - new Date().getTime()
        )

        if (items.some(item => item.value === defaultOption.value)) {
          onChange(defaultOption)
        } else {
          onChange(items[items.length - 1])
        }
      }}
    />
  )
}
