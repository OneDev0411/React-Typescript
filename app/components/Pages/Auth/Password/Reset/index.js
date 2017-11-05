import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../controllers/Brand'
import { getBrandInfo, renderField } from '../../SignIn'
import ConflictModal from '../../../Branch/components/ConflictModal'
import updatePassword from '../../../../../models/auth/password/update'

const Reset = ({
  user,
  brand,
  invalid,
  pristine,
  loginParams,
  submitError,
  isSubmitting,
  handleSubmit,
  setSubmitError,
  onSubmitHandler,
  submitSuccessfully
}) => {
  const brandInfo = getBrandInfo(brand)
  const { siteLogo, siteTitle, brandColor } = brandInfo
  const isDisabled = isSubmitting || invalid || pristine

  let content = (
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
        {!submitSuccessfully && (
          <p className="c-auth__subtitle">Reset your password</p>
        )}
      </header>
      <main className="c-auth__main">
        {!submitSuccessfully ? (
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Field
              autoFocus
              name="password"
              type="password"
              label="New Password"
              autoComplete="new-password"
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
              autoComplete="new-password"
              onChange={(e, value, newValue) => {
                if (submitError && newValue) {
                  setSubmitError(false)
                }
              }}
              component={renderField}
            />
            {submitError && (
              <div className="c-auth__submit-error-alert">
                An unexpected error occurred. Please try again.<br />
                <Link to="/password/forgot">request a new password</Link>.
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
              {isSubmitting ? 'Submitting...' : 'Reset Password'}
            </button>
            <p className="c-auth__subtitle">
              <small>Code not working?</small>&nbsp;&nbsp;
              <Link to="/password/forgot">Try sending it again</Link>
            </p>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p className="c-auth__submit-alert--success">
              <span>Your account password for email address </span>
              <b>{submitSuccessfully}</b> is now updated.<br />
              <span>Please </span>
              <Link
                to={`/signin?username=${encodeURIComponent(
                  submitSuccessfully
                )}`}
              >
                sign in
              </Link>.
            </p>
          </div>
        )}
      </main>
    </article>
  )

  if (user) {
    const params = {
      receivingUser: user,
      actionButtonProps: {
        text: 'Sign out',
        href: `/signout?redirectFromSignout=${encodeURIComponent(
          window.location.href
        )}`
      },
      messageText:
        'You are logged in on this device. To reset your password, please sign out.'
    }
    content = <ConflictModal params={params} brandInfo={brandInfo} />
  }

  return <div className="signin-page-wrapper">{content}</div>
}

const validate = values => {
  const errors = {}

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = 'Your password must be at least 6 characters.'
  }

  if (!values.confirm_password) {
    errors.confirm_password = 'Required'
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = 'Your passwords don\'t match'
  }

  return errors
}
export default compose(
  connect(({ brand }, { location: { query = {} } }) => {
    const { token, email } = query

    return {
      brand,
      loginParams: {
        token,
        email
      }
    }
  }),
  reduxForm({
    form: 'reset',
    validate
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler: ({
      loginParams,
      setIsSubmitting,
      setSubmitError,
      setSubmitSuccessfully
    }) => ({ password }) => {
      const { email, token } = loginParams

      setIsSubmitting(true)

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
