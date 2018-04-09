import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Field, reduxForm } from 'redux-form'

import FormCard from './FormCard'
import SimpleField from './SimpleField'
import PhoneNumberField from './PhoneNumberField'
import { getBrandInfo } from '../../../../Auth/SignIn'
import editUser from '../../../../../../store_actions/user/edit'

let PersonalInfoForm = ({
  brand,
  invalid,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  onSubmitHandler,
  submitSuccessfully
}) => {
  const { brandColor } = getBrandInfo(brand)
  const isDisabled = isSubmitting || invalid || pristine

  return (
    <FormCard title="Personal Info">
      <form
        className="c-account__form clearfix"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Field
          name="first_name"
          type="text"
          label="First Name"
          tabIndex={0}
          component={SimpleField}
        />
        <Field
          name="last_name"
          type="text"
          label="Last Name"
          component={SimpleField}
        />
        <Field
          name="email"
          type="email"
          label="Email"
          component={SimpleField}
          placeholder="example@gmail.com"
        />
        <Field
          name="phone_number"
          type="tel"
          label="Phone Number"
          component={PhoneNumberField}
          normalize={value => value.replace(/[^+\d]*/g, '')}
        />
        {submitError && (
          <div className="c-auth__submit-error-alert">{submitError}</div>
        )}
        {submitSuccessfully && (
          <div style={{ textAlign: 'center' }}>
            <p className="c-auth__submit-alert--success">
              Your Information updated.
            </p>
          </div>
        )}
        <button
          type="submit"
          className="c-auth__submit-btn"
          disabled={isDisabled}
          style={{
            background: brandColor,
            opacity: isDisabled ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </form>
    </FormCard>
  )
}

const validate = values => {
  const errors = {}
  const { email, phone_number, first_name, last_name } = values

  const NAME_CHARACHTER_LIMIT = 1

  const minimumCharactersError = length =>
    `Must be at least ${length} characters.`

  const invalidCharactersError =
    'Invalid charachter. You are allowed use alphabet character and space in this field.'

  const isValidName = name => name && name.trim().length > 0

  const isValidEmail = email => {
    // eslint-disable-next-line max-len
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return !email || new RegExp(regular).exec(email)
  }

  const isNotValidPhoneNumber = phoneNumber => {
    if (phoneNumber.length === 12 || phoneNumber.length === 0) {
      return false
    }

    return true
  }

  if (!isValidName(first_name)) {
    errors.first_name = invalidCharactersError
  } else if (first_name && first_name.length < NAME_CHARACHTER_LIMIT) {
    errors.first_name = minimumCharactersError(NAME_CHARACHTER_LIMIT)
  }

  if (!isValidName(last_name)) {
    errors.last_name = invalidCharactersError
  } else if (last_name && last_name.length < NAME_CHARACHTER_LIMIT) {
    errors.last_name = minimumCharactersError(NAME_CHARACHTER_LIMIT)
  }

  if (!isValidEmail(email)) {
    errors.email = 'Invalid email address.'
  }

  if (phone_number && isNotValidPhoneNumber(phone_number)) {
    errors.phone_number = 'Invalid Number!'
  }

  return errors
}

export default compose(
  connect(
    ({ brand, user }) => {
      const { first_name, last_name, email, phone_number } = user

      return {
        brand,
        initialValues: {
          email,
          last_name,
          first_name,
          phone_number: phone_number || ''
        }
      }
    },
    { editUser }
  ),
  reduxForm({
    form: 'personal_info',
    validate
  }),
  withState('submitError', 'setSubmitError', ''),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      editUser,
      initialValues,
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => async fields => {
      setSubmitError('')

      const userInfo = {}

      try {
        if (!fields.email) {
          throw new Error('Email fields could not be empty!')
        }

        Object.keys(fields).forEach(field => {
          if (initialValues[field] !== fields[field]) {
            if (field === 'phone_number' && !fields.phone_number) {
              userInfo.phone_number = null

              return
            }

            userInfo[field] = fields[field]
          }
        })

        if (Object.keys(userInfo).length > 0) {
          setIsSubmitting(true)

          const user = await editUser(userInfo)

          if (user instanceof Error) {
            throw user
          }

          setIsSubmitting(false)
          setSubmitSuccessfully(true)
          setTimeout(() => setSubmitSuccessfully(false), 3000)
        }
      } catch ({ message, response }) {
        let errorMessage = 'An unexpected error occurred. Please try again.'

        if (message && message !== 'Conflict') {
          errorMessage = message
        }

        if (response && response.body.message) {
          errorMessage = response.body.message
        }

        setIsSubmitting(false)
        setSubmitError(errorMessage)
      }
    }
  })
)(PersonalInfoForm)
