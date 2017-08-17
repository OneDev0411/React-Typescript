import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../controllers/Brand'

import { getBrandInfo, renderField } from '../../SignIn'
import resetPassword from '../../../../../models/auth/password/reset'

const Forgot = ({
  brand,
  pristine,
  submitError,
  isSubmitting,
  handleSubmit,
  setSubmitError,
  onSubmitHandler,
  resetSuccessfully
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          <Link to="/" tabIndex={-1}>
            <img
              src={siteLogo}
              alt={`${siteTitle} logo`}
              className={'c-auth__logo'}
            />
          </Link>
          <h1 className="c-auth__title tempo">
            {`${siteTitle}`}
          </h1>
          {!resetSuccessfully &&
            <p className="c-auth__subtitle">Forgot your password?</p>}
        </header>
        <main className="c-auth__main">
          {!resetSuccessfully
            ? <form onSubmit={handleSubmit(onSubmitHandler)}>
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
              {submitError &&
              <div className="c-auth__submit-error-alert">
                    Sorry, that email address is not registered with us.<br />
                <span>Please try again or</span>
                <Link to="/signup"> register for a new account</Link>.
                  </div>}
              <button
                type="submit"
                className="c-auth__submit-btn"
                disabled={isSubmitting || pristine}
                style={{
                  background: brandColor,
                  opacity: isSubmitting || pristine ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Reset Password'}
              </button>
              <p className="c-auth__subtitle">
                <small>Change your mind?</small>&nbsp;&nbsp;
                <Link to="/signin">Sign in</Link>
              </p>
            </form>
            : <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                  We've sent you an email with instructions on how to reset your
                  password.<br /> Please check <b>{resetSuccessfully}</b>.
                </p>
              <Link to="/">Back to homepage</Link>
            </div>}
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
  reduxForm({
    form: 'forgot',
    validateEmail,
    getFormState: ({ auth }) => auth.forgotPassword.form
  }),
  connect(({ brand }) => ({ brand })),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('resetSuccessfully', 'setResetSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      setIsSubmitting,
      setSubmitError,
      setResetSuccessfully
    }) => values => {
      setIsSubmitting(true)
      resetPassword(values)
        .then(statusCode => {
          if (statusCode === 200) {
            setIsSubmitting(false)
            setResetSuccessfully(values.email)
          }
        })
        .catch(error => {
          setIsSubmitting(false)
          setSubmitError(true)
        })
    }
  })
)(Forgot)
