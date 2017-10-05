import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../controllers/Brand'

import signup from '../../../../../models/auth/signup'
import { getBrandInfo, renderField } from '../../SignIn'
import resetPassword from '../../../../../models/auth/password/reset'

const ForgotForm = ({
  brand,
  invalid,
  submitError,
  isSubmitting,
  handleSubmit,
  setSubmitError,
  onSubmitHandler,
  resetSuccessfully
}) => {
  const isDisabled = isSubmitting || invalid
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          {siteLogo && (
            <Link to="/" tabIndex={-1}>
              <img
                src={siteLogo}
                alt={`${siteTitle} logo`}
                className={'c-auth__logo'}
              />
            </Link>
          )}
          <h1 className="c-auth__title din">{siteTitle}</h1>
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
                component={renderField}
              />
              {submitError && (
                <div className="c-auth__submit-error-alert">{submitError}</div>
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
                {isSubmitting ? 'Submitting...' : 'Reset Password'}
              </button>
              <p className="c-auth__subtitle">
                <small>Change your mind?</small>&nbsp;&nbsp;
                <Link to="/signin">Sign in</Link>
              </p>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                Your reset link was delivered.<br />
                Please check <b>{resetSuccessfully}</b>.
              </p>
              <Link to="/">Back to homepage</Link>
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
  connect(({ brand, auth }, { location }) => {
    const { email } = location.query
    return {
      brand,
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
    }) => async values => {
      setIsSubmitting(true)

      try {
        await resetPassword(values)
        setIsSubmitting(false)
        setResetSuccessfully(values.email)
      } catch ({ status, response }) {
        let errorMessage = 'An unexpected error occurred. Please try again.'

        if (status === 403) {
          try {
            await signup(values.email)
          } catch (error) {
            if (error === 202 && response) {
              errorMessage = `${response.body
                .message} We resent a new activation email. Please check your inbox.`
            }
          }
        }

        if (status === 404) {
          errorMessage = (
            <div>
              Sorry, that email address is not registered with us.<br />
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
