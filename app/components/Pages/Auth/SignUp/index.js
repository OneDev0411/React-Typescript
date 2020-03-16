import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { validateEmail } from '../Password/Forgot'
import { getBrandInfo } from '../SignIn/get-brand-info'
import signup from '../../../../models/auth/signup'
import Button from '../../../../views/components/Button/ActionButton'
import SimpleField from '../../Dashboard/Account/Profile/components/SimpleField'

const getErrorMessage = (errorCode, email) => {
  if (errorCode === 409) {
    return (
      <div className="c-auth__submit-alert c-auth__submit-alert--warning">
        An account with this email address exists in our system. Please{' '}
        <Link to={`/password/forgot?email=${encodeURIComponent(email)}`}>
          reset your password
        </Link>{' '}
        or{' '}
        <Link to={`/signin?username=${encodeURIComponent(email)}`}>
          sign in
        </Link>
        .
      </div>
    )
  }

  return (
    <div className="c-auth__submit-error-alert">
      There was an error with this request. Please try again.
    </div>
  )
}

const Signup = ({
  brand,
  submitError,
  isSubmitting,
  handleSubmit,
  setSubmitError,
  onSubmitHandler,
  submitSuccessfully
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
          <h1 className="c-auth__title">Sign Up</h1>
          {!submitSuccessfully ? (
            <p className="c-auth__subtitle">Hello, lets get started.</p>
          ) : (
            <p className="c-auth__subtitle">Check Your Inbox.</p>
          )}
        </header>
        <main className="c-auth__main">
          {!submitSuccessfully ? (
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
              {submitError && submitError.message}
              <Button
                type="submit"
                isBlock
                disabled={isDisabled}
                style={{ marginBottom: '2rem' }}
              >
                {isSubmitting ? 'Submitting...' : 'Sign up'}
              </Button>
              <p className="c-auth__subtitle">
                <small>Already have an account?</small>&nbsp;&nbsp;
                <Link to="/signin">Sign in</Link>
              </p>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                We {submitSuccessfully.isShadow ? 'resent a new' : ' sent an'}{' '}
                activation email.
                <br />
                Please check <b>{submitSuccessfully.email}</b>
              </p>
              <div className="c-auth__subtitle">
                <Link
                  to={`/signin?username=${encodeURIComponent(
                    submitSuccessfully.email
                  )}`}
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </main>
      </article>
    </div>
  )
}

export default compose(
  connect(({ brand }, ownProps) => {
    const email = window.decodeURIComponent(ownProps.location.query.email || '')

    return { initialValues: { email }, brand }
  }),
  reduxForm({
    form: 'signup',
    validate: validateEmail
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      setSubmitError,
      setIsSubmitting,
      setSubmitSuccessfully
    }) => async ({ email }) => {
      setIsSubmitting(true)

      try {
        const statusCode = await signup(email)

        setIsSubmitting(false)
        setSubmitSuccessfully({
          email,
          isShadow: statusCode === 202
        })
      } catch (errorCode) {
        setIsSubmitting(false)

        setSubmitError({
          email,
          message: getErrorMessage(errorCode, email)
        })
      }
    }
  })
)(Signup)
