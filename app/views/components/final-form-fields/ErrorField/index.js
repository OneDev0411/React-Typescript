import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

ErrorField.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape()),
  className: PropTypes.string,
  name: PropTypes.string.isRequired
}

ErrorField.defaultProps = {
  className: ''
}

export function ErrorField(props) {
  return (
    <Field
      name={props.name}
      subscription={{ touched: true, error: true }}
      render={({ meta }) => {
        const hasError = meta.touched && meta.error

        return (
          <div className={`${props.className} ${hasError ? 'has-error' : ''}`}>
            {props.children}
            {hasError && (
              <div
                style={{
                  marginBottom: '1em',
                  lineHeight: 1,
                  color: 'red'
                }}
              >
                {meta.error}
              </div>
            )}
          </div>
        )
      }}
    />
  )
}
