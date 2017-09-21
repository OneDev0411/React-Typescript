import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Field, reduxForm } from 'redux-form'

import FormCard from './FormCard'
import SimpleField from './SimpleField'
import AvatarUploader from './AvatarUploader'
import { getBrandInfo, renderField } from '../../../../Auth/SignIn'
import editUser from '../../../../../../store_actions/user/edit'
import updatePassword from '../../../../../../models/auth/password/update'

let PersonalInfoForm = ({
  brand,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  onSubmitHandler
}) => {
  const { brandColor } = getBrandInfo(brand)
  return (
    <FormCard title="Personal Info">
      <AvatarUploader />
      <form
        className="c-account__form clearfix"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Field
          name="first_name"
          type="text"
          label="First Name"
          tabIndex={0}
          component={SimpleField}
        />
        <Field
          name="last_name"
          type="text"
          label="Last Name"
          component={SimpleField}
        />
        <Field
          name="display_name"
          type="text"
          label="Nick Name"
          component={SimpleField}
        />
        <Field
          name="email"
          type="email"
          label="Email"
          component={SimpleField}
        />
        <Field
          name="phone_number"
          type="tel"
          label="Tel"
          component={SimpleField}
        />

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
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </form>
    </FormCard>
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

  return errors
}

PersonalInfoForm = reduxForm({
  form: 'personal_info',
  validate
})(PersonalInfoForm)

export default compose(
  connect(({ brand, user }) => {
    const { first_name, last_name, display_name, email, phone_number } = user

    return {
      brand,
      initialValues: {
        first_name,
        last_name,
        display_name,
        email,
        phone_number
      }
    }
  }),
  withState('submitError', 'setSubmitError', false),
  withState('isSubmitting', 'setIsSubmitting', false),
  withHandlers({
    onSubmitHandler: ({
      editUser,
      setSubmitError,
      setIsSubmitting
    }) => async formInputsValue => {
      setIsSubmitting(true)

      const { first_name, last_name, display_name, email } = formInputsValue

      // console.log(redirectTo, formInputsValue, userPassword, userInfo)
      try {
        await editUser(userInfo)
      } catch (error) {
        setIsSubmitting(false)
        setSubmitError(true)
      }
    }
  })
)(PersonalInfoForm)
