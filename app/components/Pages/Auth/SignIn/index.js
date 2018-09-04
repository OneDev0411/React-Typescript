import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../controllers/Brand'
import submitSigninForm from '../../../../store_actions/auth/signin'
import { grey } from '../../../../views/utils/colors'
import Button from '../../../../views/components/Button/ActionButton'
import SimpleField from '../../../Pages/Dashboard/Account/Profile/components/SimpleField'

export const getBrandInfo = brand => {
  let siteTitle = 'Rechat'
  let siteLogo = '/static/images/logo-200w.png'

  if (brand) {
    siteLogo = Brand.asset('site_logo', null, brand)
    siteTitle = Brand.message('office_title', siteTitle, brand)
  }

  return {
    siteLogo,
    siteTitle
  }
}

export const renderField = ({
  type,
  input,
  label,
  require,
  autoComplete = 'on',
  meta: { dirty, error }
}) => {
  const hasError = dirty && error

  return (
    <div className={`c-auth__field ${input.name}`}>
      <div className="c-auth__field__input-wrapper">
        <input
          {...input}
          type={type}
          id={input.name}
          autoComplete={autoComplete}
          className={`c-auth__field__input ${(input.value && 'has-content') ||
            ''} ${hasError ? 'has-error' : ''}`}
        />
        <label htmlFor={input.name} className="c-auth__field__label">
          <span>{label}</span>
          {require && <sup>*</sup>}
        </label>
        <span className="focus-border">
          <i />
        </span>
      </div>
      {hasError && <div className="c-auth__field__error-alert">{error}</div>}
    </div>
  )
}

const SigninForm = ({
  brand,
  invalid,
  pristine,
  isLogging,
  submitError,
  handleSubmit,
  onSubmitHandler
}) => {
  const isDisabled = isLogging || invalid || pristine
  const { siteLogo, siteTitle } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          {siteLogo && (
            <Link to="/" tabIndex={-1}>
              <img
                src={siteLogo}
                alt={`${siteTitle} logo`}
                className="c-auth__logo"
              />
            </Link>
          )}
          <h1 className="c-auth__title din">{siteTitle}</h1>
          <p className="c-auth__subtitle">Hi, welcome back!</p>
        </header>
        <main className="c-auth__main">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Field
              name="username"
              type="email"
              label="Email"
              tabIndex={0}
              component={SimpleField}
            />
            <Field
              name="password"
              type="password"
              label="Password"
              component={SimpleField}
            />
            <div className="c-forgot u-align-right">
              <Link to="/password/forgot">Forgot your password?</Link>
            </div>
            {submitError && (
              <div className="c-auth__submit-error-alert">
                The email or password is incorrect. Please try again.
              </div>
            )}
            <Button
              type="submit"
              isBlock
              disabled={isDisabled}
              style={{ marginBottom: '2em' }}
            >
              {isLogging ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p style={{ textAlign: 'center', color: grey.A600 }}>
            <small>Don't have an account?</small>&nbsp;&nbsp;
            <Link to="/signup">Sign up</Link>
          </p>
        </main>
      </article>
    </div>
  )
}

const validate = values => {
  const errors = {}

  if (!values.username) {
    errors.username = 'Required'
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
  ) {
    errors.username = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = 'Must be at least 6 characters.'
  }

  return errors
}

export default compose(
  connect(
    ({ brand, auth: { signin } }, { location: { query = {}, state = {} } }) => {
      const { username } = query
      const { isLogging, error: submitError } = signin
      const redirectTo = state.redirectTo || query.redirectTo

      return {
        brand,
        isLogging,
        redirectTo,
        submitError,
        initialValues: { username }
      }
    },
    { submitSigninForm }
  ),
  reduxForm({
    form: 'signin',
    validate
  }),
  withHandlers({
    onSubmitHandler: ({ submitSigninForm, redirectTo }) => values => {
      submitSigninForm(values, redirectTo)
    }
  })
)(SigninForm)
