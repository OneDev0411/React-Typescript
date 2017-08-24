import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { getBrandInfo, renderField } from '../SignIn'
import Brand from '../../../../controllers/Brand'

export const renderAgentField = ({ id, input, label, checked }) =>
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
      <span>
        {label}
      </span>
    </label>
  </div>

const RegisterForm = ({
  brand,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  onSubmitHandler,
  paramsFromURI: { email, phone_number, new_email }
}) => {
  const { siteLogo, siteTitle, brandColor } = getBrandInfo(brand)

  return (
    <div className="signin-page-wrapper c-auth--register clearfix">
      <div className="c-auth--register__houseIcon">
        <img src="/static/images/signup/house.png" />
      </div>
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
            {phone_number &&
              new_email &&
              <Field
                name="email"
                type="email"
                label="Email"
                component={renderField}
              />}
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
            {submitError &&
              <div className="c-auth__submit-error-alert">
                There was an error with this request. Please try again.
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

  if (!values.first_name) {
    errors.first_name = 'Required'
  } else if (values.first_name.length < 3) {
    errors.first_name = 'Must be at least 3 characters or more'
  }

  if (!values.last_name) {
    errors.last_name = 'Required'
  } else if (values.last_name.length < 3) {
    errors.last_name = 'Must be at least 3 characters or more'
  }

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
  connect(({ brand, auth }, { location }) => ({
    brand,
    paramsFromURI: location.query
  })),
  reduxForm({
    form: 'register',
    validate,
    initialValues: { user_type: 'Client' },
    getFormState: ({ auth }) => auth.register.form
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withHandlers({
    onSubmitHandler: ({
      paramsFromURI,
      setSubmitError,
      setIsSubmitting
    }) => async formInputsValue => {
      const {
        first_name,
        last_name,
        email,
        password,
        user_type
      } = formInputsValue

      const {
        room,
        token,
        alert,
        action,
        listing,
        new_email,
        phone_number,
        receiving_user,
        email: emailFromURI
      } = paramsFromURI

      const userPassword = {
        password,
        shadow_token: token,
        email: new_email ? email : emailFromURI,
        agent: user_type === 'Agent' ? true : null
      }

      const userInfo = {
        last_name,
        first_name,
        email: phone_number && new_email ? email : emailFromURI
      }

      console.log(formInputsValue, userPassword, userInfo)
    }
  })
)(RegisterForm)
