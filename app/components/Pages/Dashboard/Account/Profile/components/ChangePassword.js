import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { reduxForm } from 'redux-form'
import { Button } from '@material-ui/core'

import { updateUser } from 'actions/user'

import FormCard from 'components/FormCard'

import getUser from '../../../../../../models/user/get-user/index'

import Field from './Field'
import SimpleField from './SimpleField'
import changePassword from '../../../../../../models/user/change-password'

const ChangePasswordForm = ({
  user,
  invalid,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  setSubmitError,
  onSubmitHandler,
  submitSuccessfully
}) => {
  const hasUserPassword = user.has_password
  const isDisabled = isSubmitting || (invalid && !pristine)
  const getSubmitButtonText = () => {
    if (user.has_password) {
      return isSubmitting ? 'Updating...' : 'Update'
    }

    return isSubmitting ? 'Creating...' : 'Create'
  }

  return (
    <FormCard title={hasUserPassword ? 'Change Password' : 'New Password'}>
      <form
        className="c-account__form clearfix"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        {hasUserPassword && (
          <Field
            component={SimpleField}
            label="Current Password"
            name="old_password"
            type="password"
            onChange={(e, value, newValue) => {
              if (submitError && newValue) {
                setSubmitError(false)
              }
            }}
          />
        )}
        <Field
          autoComplete="new-password"
          component={SimpleField}
          label="New Password"
          name="new_password"
          type="password"
          onChange={(e, value, newValue) => {
            if (submitError && newValue) {
              setSubmitError(false)
            }
          }}
        />
        <Field
          autoComplete="new-password"
          component={SimpleField}
          label="Confirm New Password"
          name="confirm_password"
          type="password"
          onChange={(e, value, newValue) => {
            if (submitError && newValue) {
              setSubmitError(false)
            }
          }}
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
        <div style={{ textAlign: 'right' }}>
          <Button
            color="secondary"
            variant="contained"
            type="submit"
            disabled={isDisabled}
            data-test="change-password-form-submit-button"
          >
            {getSubmitButtonText()}
          </Button>
        </div>
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
      "Your new password can't be match with your old password!"
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Required'
  } else if (values.confirm_password !== values.new_password) {
    errors.confirm_password = "Your passwords don't match"
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
  connect(
    ({ brand, user }) => ({
      brand,
      user
    }),
    { updateUser }
  ),
  reduxForm({
    form: 'change_password',
    validate
  }),
  withState('submitError', 'setSubmitError', null),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      user,
      reset,
      updateUser,
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => async formInputsValue => {
      const { old_password, new_password } = formInputsValue

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        await changePassword({ old_password, new_password })

        const updatedUser = await getUser(user.id)

        updateUser(updatedUser)
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
