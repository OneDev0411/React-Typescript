import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Field, reduxForm } from 'redux-form'

import { getBrandInfo, renderField } from '../SignIn'
import Brand from '../../../../controllers/Brand'

import editUser from '../../../../store_actions/user/edit'
import submitSigninForm from '../../../../store_actions/auth/signin'
import updatePassword from '../../../../models/auth/password/update'

export const renderAgentField = ({ id, input, label, checked }) => (
  <div className="c-auth__field--radio">
    <input
      {...input}
      id={id}
      value={id}
      type="radio"
      defaultChecked={checked}
      className="c-auth__field--radio__input"
    />
    <label htmlFor={id} className="c-auth__field--radio__label">
      <svg
        fill="#35b863"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
        className="c-auth__field--radio__label__icon"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
      <span>{label}</span>
    </label>
  </div>
)

const RegisterForm = ({
  brand,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  onSubmitHandler,
  paramsFromURI: { email, phone_number }
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper c-auth--register clearfix">
      <div className="c-auth--register__houseIcon">
        <img src="/static/images/signup/house.png" alt="rechat house" />
      </div>
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
          <h1 className="c-auth__title tempo">{`${siteTitle}`}</h1>
          <p className="c-auth__subtitle">Thanks! You're almost there...</p>
          <div>
            <small>
              Please fill out the details below to set up your profile.
            </small>
          </div>
        </header>
        <main className="c-auth__main">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <Field
              name="first_name"
              type="text"
              label="First Name"
              tabIndex={0}
              component={renderField}
            />
            <Field
              name="last_name"
              type="text"
              label="Last Name"
              component={renderField}
            />
            {phone_number && (
              <Field
                name="email"
                type="email"
                label="Email"
                component={renderField}
              />
            )}
            <Field
              name="password"
              type="password"
              label="Password"
              component={renderField}
            />
            <div className="clearfix" style={{ marginTop: '-1rem' }}>
              <Field
                checked
                id="Client"
                name="user_type"
                label="I'm a client"
                component={renderAgentField}
              />
              <Field
                id="Agent"
                name="user_type"
                label="I'm an agent"
                component={renderAgentField}
              />
            </div>
            {submitError && (
              <div className="c-auth__submit-error-alert">
                An unexpected error occurred. Please try again.
              </div>
            )}
            <button
              type="submit"
              className="c-auth__submit-btn"
              disabled={isSubmitting || pristine}
              style={{
                background: brandColor,
                opacity: isSubmitting || pristine ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>
          </form>
        </main>
      </article>
    </div>
  )
}

const validate = values => {
  const errors = {}
  const minimumCharactersError = length =>
    `Must be at least ${length} characters.`
  const invalidCharactersError =
    'Invalid charachter. You are allowed use alphabet character and space in this field.'
  const isValidName = name => new RegExp(/^[A-Za-z\s]+$/).exec(name)

  if (!values.first_name) {
    errors.first_name = 'Required'
  } else if (!isValidName(values.first_name)) {
    errors.first_name = invalidCharactersError
  } else if (values.first_name.length < 3) {
    errors.first_name = minimumCharactersError(3)
  }

  if (!values.last_name) {
    errors.last_name = 'Required'
  } else if (!isValidName(values.last_name)) {
    errors.last_name = invalidCharactersError
  } else if (values.last_name.length < 3) {
    errors.last_name = minimumCharactersError(3)
  }

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address.'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password.length < 6) {
    errors.password = minimumCharactersError(6)
  }

  return errors
}

export default compose(
  connect(
    ({ brand }, { location: { query } }) => ({
      brand,
      paramsFromURI: query
    }),
    { submitSigninForm, editUser }
  ),
  reduxForm({
    form: 'register',
    validate,
    initialValues: { user_type: 'Client' }
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withHandlers({
    onSubmitHandler: ({
      editUser,
      setWidget,
      paramsFromURI,
      setSubmitError,
      setIsSubmitting,
      submitSigninForm
    }) => async formInputsValue => {
      setIsSubmitting(true)

      const {
        first_name,
        last_name,
        email,
        password,
        user_type
      } = formInputsValue

      const {
        token,
        redirectTo,
        phone_number,
        email: emailFromURI
      } = paramsFromURI

      const userPassword = {
        password,
        shadow_token: token
      }

      const userInfo = {
        last_name,
        first_name,
        is_shadow: false
      }

      const loginInfo = {
        password,
        username: email || emailFromURI
      }

      if (phone_number) {
        userInfo.email = email
        userPassword.email = emailFromURI
        userPassword.phone_number = phone_number
      } else if (emailFromURI) {
        userPassword.email = emailFromURI
      }

      // console.log(redirectTo, formInputsValue, userPassword, userInfo)
      try {
        let redirect = '/dashboard/mls'
        await updatePassword(userPassword)

        if (user_type === 'Agent') {
          redirect = `/dashboard/account/upgrade?redirectTo=${encodeURIComponent(
            redirectTo
          )}`
        }

        await submitSigninForm(loginInfo, redirect)
        await editUser(userInfo)
      } catch (error) {
        setIsSubmitting(false)
        setSubmitError(true)
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const { location } = this.props
      const { token } = location.query

      if (!token) {
        browserHistory.push('/oops')
      }
    }
  })
)(RegisterForm)
