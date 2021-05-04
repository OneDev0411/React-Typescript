import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { reduxForm } from 'redux-form'
import { Button } from '@material-ui/core'

import FormCard from 'components/FormCard'

import Field from './Field'
import Catalog from './ProfileCatalog'
import SimpleField from './SimpleField'
import PhoneNumberField from './PhoneNumberField'
import VerifyMobileNumber from './VerifyPhoneNumber'

import editUser from '../../../../../../store_actions/user/edit'

let PersonalInfoForm = ({
  user,
  invalid,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  onSubmitHandler,
  submitSuccessfully
}) => {
  const isDisabled = isSubmitting || (invalid && !pristine)

  return (
    <FormCard title="Personal Info">
      <form
        className="c-account__form clearfix"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Catalog user={user} />
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
          label="Mobile Number"
          component={PhoneNumberField}
          format={value => value.replace(/\+1|[^+\d]*/g, '')}
        />
        <VerifyMobileNumber />
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
        <div style={{ textAlign: 'right' }}>
          <Button
            color="secondary"
            variant="contained"
            disabled={isDisabled}
            type="submit"
            data-test="personal-info-form-submit-button"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </FormCard>
  )
}

const validate = values => {
  const errors = {}
  const { email, first_name, last_name } = values

  const NAME_CHARACTER_LIMIT = 1

  const minimumCharactersError = length =>
    `Must be at least ${length} characters.`

  const invalidCharactersError =
    'Invalid character. You only are allowed to use alphabet characters and spaces in this field.'

  const isValidName = name => name && name.trim().length > 0

  const isValidEmail = email => {
    // eslint-disable-next-line max-len
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return !email || new RegExp(regular).exec(email)
  }

  if (!isValidName(first_name)) {
    errors.first_name = invalidCharactersError
  } else if (first_name && first_name.length < NAME_CHARACTER_LIMIT) {
    errors.first_name = minimumCharactersError(NAME_CHARACTER_LIMIT)
  }

  if (!isValidName(last_name)) {
    errors.last_name = invalidCharactersError
  } else if (last_name && last_name.length < NAME_CHARACTER_LIMIT) {
    errors.last_name = minimumCharactersError(NAME_CHARACTER_LIMIT)
  }

  if (!isValidEmail(email)) {
    errors.email = 'Invalid email address.'
  }

  return errors
}

export default compose(
  connect(
    ({ brand, user }) => {
      const { first_name, last_name, email, phone_number } = user

      return {
        brand,
        user,
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
