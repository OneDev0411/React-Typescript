import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { FormControlLabel, Checkbox } from '@material-ui/core'

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string
}

CheckboxField.defaultProps = {
  id: 'mark-as-done-checkbox'
}

export function CheckboxField(props) {
  return (
    <Field
      name={props.name}
      render={({ input }) => {
        const checked = input.value === 'DONE'

        return (
          <FormControlLabel
            control={
              <Checkbox
                {...input}
                checked={checked}
                disabled={checked}
                onChange={() => {
                  const value = checked ? 'PENDING' : 'DONE'

                  input.onChange(value)
                }}
                color="primary"
              />
            }
            label={checked ? 'Marked as done' : 'Mark as done'}
          />
        )
      }}
    />
  )
}
