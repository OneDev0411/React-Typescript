import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Field, reduxForm } from 'redux-form'

import FormCard from './FormCard'
import SimpleField from './SimpleField'
import { getBrandInfo } from '../../../../Auth/SignIn'
import changePassword from '../../../../../../models/user/change-password'

const ChangePasswordForm = ({
  brand,
  invalid,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  setSubmitError,
  onSubmitHandler,
  submitSuccessfully
}) => {
  const isDisabled = isSubmitting || invalid || pristine
  const { brandColor } = getBrandInfo(brand)

  return (
    <FormCard title="Change Password">
      <form
        className="c-account__form clearfix"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Field
          name="old_password"
          type="password"
          label="Current Password"
          onChange={(e, value, newValue) => {
            if (submitError && newValue) {
              setSubmitError(false)
            }
          }}
          component={SimpleField}
        />
        <Field
          name="new_password"
          type="password"
          label="New Password"
          onChange={(e, value, newValue) => {
            if (submitError && newValue) {
              setSubmitError(false)
            }
          }}
          component={SimpleField}
        />
        <Field
          type="password"
          name="confirm_password"
          label="Confirm New Password"
          onChange={(e, value, newValue) => {
            if (submitError && newValue) {
              setSubmitError(false)
            }
          }}
          component={SimpleField}
        />
        {submitError && (
          <div className="c-auth__submit-error-alert">
            {submitError.message}
          </div>
        )}
        {submitSuccessfully && (
          <div style={{ textAlign: 'center' }}>
            <p className="c-auth__submit-alert--success">
              Your password updated.
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

  if (!values.old_password) {
    errors.old_password = 'Required'
  }

  if (!values.new_password) {
    errors.new_password = 'Required'
  } else if (values.new_password.length < 6) {
    errors.new_password = 'Your password must be at least 6 characters.'
  } else if (values.old_password === values.new_password) {
    errors.new_password =
      'Your new password can\'t be match with your old password!'
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Required'
  } else if (values.confirm_password !== values.new_password) {
    errors.confirm_password = 'Your passwords don\'t match'
  }

  return errors
}

const getErrorMessage = errorCode => {
  switch (errorCode) {
    case 403:
      return 'Your current Password is incorrect!'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

export default compose(
  connect(({ brand }) => ({
    brand
  })),
  reduxForm({
    form: 'change_password',
    validate
  }),
  withState('submitError', 'setSubmitError', null),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      reset,
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => async formInputsValue => {
      const { old_password, new_password } = formInputsValue

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        await changePassword({ old_password, new_password })
        reset()
        setIsSubmitting(false)
        setSubmitSuccessfully(true)

        setTimeout(() => setSubmitSuccessfully(false), 2000)
      } catch (errorCode) {
        setIsSubmitting(false)
        setSubmitError({ message: getErrorMessage(errorCode) })
      }
    }
  })
)(ChangePasswordForm)
