import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../controllers/Brand'

const renderField = ({
  input,
  label,
  type,
  placeholder,
  meta: { touched, error, warning }
}) =>
  <div className={`c-auth__field ${input.name}`}>
    <div className="c-auth__field__input-wrapper">
      <input
        type={type}
        className={`c-auth__field__input ${(input.value && 'has-content') ||
          ''}`}
        {...input}
      />
      <label className="c-auth__field__label">
        {label}
      </label>
      <span className="focus-border">
        <i />
      </span>
    </div>
    <div>
      {touched &&
        ((error &&
          <span>
            {error}
          </span>) ||
          (warning &&
            <span>
              {warning}
            </span>))}
    </div>
  </div>

const Signin = ({
  appData,
  pristine,
  submitting,
  handleSubmit,
  onSubmitHandler,
  warnEmail,
  warnPassword,
  validateEmail,
  validatePassword
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
              warn={warnEmail}
              validate={validateEmail}
              onChange={(e, value, nextValue) => {
                console.log(value)
              }}
            />
            <Field
              name="password"
              type="password"
              label="Password"
              component={renderField}
              warn={warnPassword}
              validate={validatePassword}
              onChange={(e, value, nextValue) => {
                console.log(value)
              }}
            />
            <Link to="/password/forgot">Forgot Password?</Link>
            <button
              type="submit"
              className="c-auth__submit-btn"
              disabled={submitting}
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

export default compose(
  connect(({ data }) => ({ appData: data })),
  reduxForm({
    form: 'signin',
    getFormState: ({ auth }) => auth.signin.form
  }),
  withHandlers({
    onSubmitHandler: ({ submitSigninForm }) => values => {
      submitSigninForm(values)
    }
  })
)(Signin)
