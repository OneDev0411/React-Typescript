import React from 'react'
import { Form, Field } from 'react-final-form'

import SubmitButton from './SubmitButton'
import SimpleField from '../../Dashboard/Account/Profile/components/SimpleField'

interface Props {
  brandColor: string
  isLoading: boolean
  error: string
  onSubmit: (values) => void
}

export default function LookupForm(props: Props) {
  const validate = values => {
    const errors: { username?: string } = {}

    if (!values.username) {
      errors.username = 'Required'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
    ) {
      errors.username = 'Invalid email address'
    }

    return errors
  }

  return (
    <Form
      onSubmit={props.onSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="username"
            type="email"
            label="Email"
            tabIndex={0}
            component={SimpleField}
          />

          <SubmitButton
            isDisabled={props.isLoading}
            color={props.brandColor}
            text={props.isLoading ? 'Looking...' : 'Next'}
          />
          {props.error && (
            <div className="c-auth__submit-error-alert">{props.error}</div>
          )}
        </form>
      )}
    />
  )
}
