import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

WhenFieldChanges.propTypes = {
  set: PropTypes.string.isRequired,
  setter: PropTypes.func.isRequired,
  watch: PropTypes.string.isRequired
}

export function WhenFieldChanges({ watch, set, setter }) {
  return (
    <Field name={set}>
      {({ input: { onChange } }) => (
        <OnChange name={watch}>{() => setter(onChange)}</OnChange>
      )}
    </Field>
  )
}
