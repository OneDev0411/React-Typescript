import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

const Error = ({ name, children, className }) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) => {
      const hasError = touched && error

      return (
        <div className={`${className} ${hasError ? 'has-error' : ''}`}>
          {children}
          {hasError && <div className="c-new-task__field__error">{error}</div>}
        </div>
      )
    }}
  />
)

Error.propTypes = {
  name: PropTypes.string.isRequired
}

export default Error
