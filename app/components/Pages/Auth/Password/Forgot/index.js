import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import signup from '../../../../../models/auth/signup'
import { getBrandInfo } from '../../SignIn/get-brand-info'
import resetPassword from '../../../../../models/auth/password/reset'
import Button from '../../../../../views/components/Button/ActionButton'
import SimpleField from '../../../Dashboard/Account/Profile/components/SimpleField'

const ForgotForm = ({
  brand,
  username,
  submitError,
  isSubmitting,
  handleSubmit,
  setSubmitError,
  onSubmitHandler,
  resetSuccessfully
}) => {
  const isDisabled = isSubmitting
  const { siteLogo, siteTitle } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          {siteLogo && (
            <a href="/" tabIndex={-1}>
              <img
                src={siteLogo}
                alt={`${siteTitle} logo`}
                className="c-auth__logo"
              />
            </a>
          )}
          {!resetSuccessfully && (
            <p className="c-auth__subtitle">Forgot your password?</p>
          )}
        </header>
        <main className="c-auth__main">
          {!resetSuccessfully ? (
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <Field
                autoFocus
                name="email"
                type="email"
                label="Email"
                onChange={(e, value, newValue) => {
                  if (submitError && newValue) {
                    setSubmitError(false)
                  }
                }}
                component={SimpleField}
              />
              {submitError && (
                <div className="c-auth__submit-error-alert">{submitError}</div>
              )}
              <Button
                type="submit"
                isBlock
                disabled={isDisabled}
                style={{ marginBottom: '2em' }}
              >
                {isSubmitting ? 'Submitting...' : 'Reset Password'}
              </Button>
              <p className="c-auth__subtitle">
                <small>Change your mind?</small>&nbsp;&nbsp;
                <Link to={`/signin?username=${encodeURIComponent(username)}`}>
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                Your reset link was delivered.
                <br />
                Please check <b>{resetSuccessfully}</b>.
              </p>
              <a className="c-auth__subtitle" href="/">
                Back to homepage
              </a>
            </div>
          )}
        </main>
      </article>
    </div>
  )
}

export const validateEmail = values => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  return errors
}

export default compose(
  connect(({ brand }, { location }) => {
    const { email } = location.query

    return {
      brand,
      username: email,
      initialValues: { email }
    }
  }),
  reduxForm({
    form: 'forgot',
    validate: validateEmail
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('resetSuccessfully', 'setResetSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      setIsSubmitting,
      setSubmitError,
      setResetSuccessfully
    }) => async ({ email }) => {
      setIsSubmitting(true)

      try {
        const response = await resetPassword(email)

        if (response.status === 204) {
          setIsSubmitting(false)
          setResetSuccessfully(email)
        }
      } catch ({ status, response }) {
        if (status === 403) {
          try {
            await signup(email)
          } catch (error) {}

          setIsSubmitting(false)
          setResetSuccessfully(email)

          return
        }

        let errorMessage = 'An unexpected error occurred. Please try again.'

        if (status === 404) {
          errorMessage = (
            <div>
              Sorry, that email address is not registered with us.
              <br />
              <span>Please try again or</span>
              <Link to="/signup"> register for a new account</Link>.
            </div>
          )
        }

        setIsSubmitting(false)
        setSubmitError(errorMessage)
      }
    }
  })
)(ForgotForm)
