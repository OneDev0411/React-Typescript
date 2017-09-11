import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../controllers/Brand'

import { validateEmail } from '../Password/Forgot'
import { getBrandInfo, renderField } from '../SignIn'
import signupShadow from '../../../../models/auth/signup/shadow'

const getErrorMessage = (errorCode, email) => {
  switch (errorCode) {
    case 409:
      return (
        <div className="c-auth__submit-alert c-auth__submit-alert--warning">
          An account with this email address exists in our system. Please <Link to={`/password/forgot?email=${encodeURIComponent(email)}`}>reset your password</Link> or <Link to={`/signin?username=${encodeURIComponent(email)}`}>sign in</Link>.
        </div>
      )
    case 202:
      return (
        <div className="c-auth__submit-alert c-auth__submit-alert--warning">
          An account with this email address exists in our system.  We resent a new activation email. Please check your inbox.
        </div>
      )
    default:
      return (
        <div className="c-auth__submit-error-alert">
          There was an error with this request. Please try again.
        </div>
      )
  }
}

const Signup = ({
  brand,
  pristine,
  submitError,
  isSubmitting,
  handleSubmit,
  setSubmitError,
  onSubmitHandler,
  submitSuccessfully
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
          {!submitSuccessfully
            ? <p className="c-auth__subtitle">Hello, lets get started.</p>
            : <p className="c-auth__subtitle">Check Your Inbox.</p>}
        </header>
        <main className="c-auth__main">
          {!submitSuccessfully
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
              {submitError && submitError.message}
              <button
                type="submit"
                className="c-auth__submit-btn"
                disabled={isSubmitting || pristine}
                style={{
                  background: brandColor,
                  opacity: isSubmitting || pristine ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Signup'}
              </button>
              <p className="c-auth__subtitle">
                <small>Already have an account?</small>&nbsp;&nbsp;
                <Link to="/signin">Sign in</Link>
              </p>
            </form>
            : <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                <span>
                    Check your email and confirm your email address to continue.
                  </span>
                <br />
                <span>Please, </span>
                <Link
                  to={`/signin?username=${encodeURIComponent(
                      submitSuccessfully
                    )}`}
                >
                    SIGN IN
                  </Link>.
                </p>
            </div>}
        </main>
      </article>
    </div>
  )
}

export default compose(
  reduxForm({
    form: 'signup',
    validate: validateEmail,
    getFormState: ({ auth }) => auth.signup.form
  }),
  connect(({ brand }) => ({ brand })),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => ({ email }) => {
      setIsSubmitting(true)

      signupShadow(email)
        .then(statusCode => {
          if (statusCode === 200) {
            setIsSubmitting(false)
            setSubmitSuccessfully(email)
          }
        })
        .catch(errorCode => {
          setIsSubmitting(false)
          setSubmitError({
            email,
            message: getErrorMessage(errorCode, email)
          })
        })
    }
  })
)(Signup)
