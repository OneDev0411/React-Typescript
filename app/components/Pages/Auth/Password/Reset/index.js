import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../controllers/Brand'

import Crypto from '../../../../../utils/crypto'
import { getBrandInfo, renderField } from '../../SignIn'
import updatePassword from '../../../../../models/auth/password/update'

const decodeURIToken = codedToken =>
  JSON.parse(Crypto.decrypt(decodeURIComponent(codedToken)))

const Reset = ({
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
          {!submitSuccessfully &&
            <p className="c-auth__subtitle">Reset your password</p>}
        </header>
        <main className="c-auth__main">
          {!submitSuccessfully
            ? <form onSubmit={handleSubmit(onSubmitHandler)}>
              <Field
                autoFocus
                name="password"
                type="password"
                label="New Password"
                onChange={(e, value, newValue) => {
                  if (submitError && newValue) {
                    setSubmitError(false)
                  }
                }}
                component={renderField}
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
                component={renderField}
              />
              {submitError &&
              <div className="c-auth__submit-error-alert">
                    Sorry, seems there was an error with this request.<br />
                <span>Please </span>
                <Link to="/password/forgot">request a new password</Link>.
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
                <small>Code not working?</small>&nbsp;&nbsp;
                <Link to="/password/forgot">Try sending it again</Link>
              </p>
            </form>
            : <div style={{ textAlign: 'center' }}>
              <p className="c-auth__submit-alert--success">
                <span>Your account password with this email</span>
                <b>{submitSuccessfully}</b> is now changed.<br />
                <span>You may now </span>
                <Link to={`/signin?username=${encodeURIComponent(submitSuccessfully)}`}>sign in</Link>.
              </p>
            </div>}
        </main>
      </article>
    </div>
  )
}

const validate = values => {
  const errors = {}

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = 'Your password must be at least 6 characters long'
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Required'
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = 'Your passwords don\'t match'
  }

  return errors
}
export default compose(
  connect(({ brand }, { location }) => {
    const { token } = location.query
    return {
      brand,
      codedToken: token
    }
  }),
  reduxForm({
    form: 'reset',
    validate,
    getFormState: ({ auth }) => auth.resetPassword.form
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      codedToken,
      setIsSubmitting,
      setSubmitError,
      setSubmitSuccessfully
    }) => ({ password }) => {
      setIsSubmitting(true)

      const { email, token } = decodeURIToken(codedToken)
      updatePassword({ email, password, token })
        .then(statusCode => {
          if (statusCode === 200) {
            setIsSubmitting(false)
            setSubmitSuccessfully(email)
          }
        })
        .catch(error => {
          setIsSubmitting(false)
          setSubmitError(true)
        })
    }
  })
)(Reset)
