import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../controllers/Brand'

const renderField = ({ type, input, label, meta: { touched, error } }) => {
  const hasError = touched && error
  return (
    <div className={`c-auth__field ${input.name}`}>
      <div className="c-auth__field__input-wrapper">
        <input
          {...input}
          type={type}
          className={`c-auth__field__input ${(input.value && 'has-content') ||
            ''} ${hasError ? 'has-error' : ''}`}
        />
        <label className="c-auth__field__label">
          {label}
        </label>
        <span className="focus-border">
          <i />
        </span>
      </div>
      {hasError &&
        <div className="c-auth__field__error-alert">
          {error}
        </div>}
    </div>
  )
}

const Signin = ({
  appData,
  pristine,
  submitting,
  handleSubmit,
  onSubmitHandler
}) => {
  const { brand } = appData
  const siteTitle = (brand && brand.messages.site_title) || 'Rechat'
  const siteLogo =
    (brand && Brand.asset('site_logo')) || 'static/images/logo-200w.png'

  return (
    <div className="signin-page-wrapper">
      <article className="c-auth">
        <header className="c-auth__header">
          <img
            src={siteLogo}
            alt={`${siteTitle} logo`}
            className={'c-auth__logo'}
          />
          <p>Sign into</p>
          <h1 className="c-auth__title tempo">
            {`${siteTitle || 'Rechat'}`}
          </h1>
          {/* <p>It’s nice to have you back!</p>*/}
        </header>
        <main className="c-auth__main">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Field
              name="email"
              type="email"
              label="Email"
              component={renderField}
            />
            <Field
              name="password"
              type="password"
              label="Password"
              component={renderField}
            />
            <Link to="/password/forgot">Forgot Password?</Link>
            <button
              type="submit"
              disabled={submitting}
              className="c-auth__submit-btn"
              style={{ background: `#${Brand.color('primary', '#2196f3')}` }}
            >
              Sign in
            </button>
          </form>
          <p style={{ textAlign: 'center', color: '#929292' }}>
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

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = 'Must be at least 6 characters or more'
  }

  return errors
}

export default compose(
  connect(({ data }) => ({ appData: data })),
  reduxForm({
    form: 'signin',
    validate,
    getFormState: ({ auth }) => auth.signin.form
  }),
  withHandlers({
    onSubmitHandler: ({ submitSigninForm }) => values => {
      console.log(values)
      // submitSigninForm(values)
    }
  })
)(Signin)
