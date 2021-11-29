import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import { reduxForm } from 'redux-form'

import FormCard from 'components/FormCard'

import editUser from '../../../../../../store_actions/user/edit'

import Field from './Field'
import PhoneNumberField from './PhoneNumberField'
import Catalog from './ProfileCatalog'
import SimpleField from './SimpleField'
import VerifyMobileNumber from './VerifyPhoneNumber'

let PersonalInfoForm = ({
  user,
  invalid,
  pristine,
  submitError,
  handleSubmit,
  isSubmitting,
  onSubmitHandler,
  submitSuccessfully
}) => {
  const isDisabled = isSubmitting || (invalid && !pristine)

  return (
    <FormCard title="Personal Info">
      <form
        className="c-account__form clearfix"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <Catalog user={user} />
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
          name="email"
          type="email"
          label="Email"
          component={SimpleField}
          placeholder="example@gmail.com"
        />
        <Field
          name="phone_number"
          type="tel"
          label="Mobile Number"
          component={PhoneNumberField}
          format={value => value.replace(/\+1|[^+\d]*/g, '')}
        />
        <VerifyMobileNumber />

        {/* socials */}
        <hr />

        <Field
          name="website"
          type="text"
          label="Website"
          component={SimpleField}
          required={false}
          placeholder="https://www.example.com"
        />
        <Field
          name="instagram"
          type="text"
          label="Instagram"
          component={SimpleField}
          required={false}
          placeholder="https://www.instagram.com/<username>"
        />
        <Field
          name="facebook"
          type="text"
          label="Facebook"
          component={SimpleField}
          required={false}
          placeholder="https://www.fb.com/<username>"
        />
        <Field
          name="linkedin"
          type="text"
          label="LinkedIn"
          component={SimpleField}
          required={false}
          placeholder="https://www.linkedin.com/<username>"
        />
        <Field
          name="youtube"
          type="text"
          label="Youtube"
          component={SimpleField}
          required={false}
          placeholder="https://www.youtube.com/<username>"
        />
        <Field
          name="twitter"
          type="text"
          label="Twitter"
          component={SimpleField}
          required={false}
          placeholder="https://www.twitter.com/<username>"
        />

        {submitError && (
          <div className="c-auth__submit-error-alert">{submitError}</div>
        )}
        {submitSuccessfully && (
          <div style={{ textAlign: 'center' }}>
            <p className="c-auth__submit-alert--success">
              Your Information updated.
            </p>
          </div>
        )}
        <div style={{ textAlign: 'right' }}>
          <Button
            color="secondary"
            variant="contained"
            disabled={isDisabled}
            type="submit"
            data-test="personal-info-form-submit-button"
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </FormCard>
  )
}

const isValidURL = url => {
  const validUrlRegex =
    /^(http[s]?:\/\/)?(www.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

  try {
    return validUrlRegex.test(url)
  } catch (_) {
    return false
  }
}

const validate = values => {
  const errors = {}
  const {
    email,
    first_name,
    last_name,
    website,
    instagram,
    facebook,
    linkedin,
    youtube,
    twitter
  } = values

  const NAME_CHARACTER_LIMIT = 1

  const minimumCharactersError = length =>
    `Must be at least ${length} characters.`

  const invalidCharactersError =
    // eslint-disable-next-line max-len
    'Invalid character. You only are allowed to use alphabet characters and spaces in this field.'

  const isValidName = name => name && name.trim().length > 0

  const isValidEmail = email => {
    // eslint-disable-next-line max-len
    const regular =
      // eslint-disable-next-line max-len
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return !email || new RegExp(regular).exec(email)
  }

  if (!isValidName(first_name)) {
    errors.first_name = invalidCharactersError
  } else if (first_name && first_name.length < NAME_CHARACTER_LIMIT) {
    errors.first_name = minimumCharactersError(NAME_CHARACTER_LIMIT)
  }

  if (!isValidName(last_name)) {
    errors.last_name = invalidCharactersError
  } else if (last_name && last_name.length < NAME_CHARACTER_LIMIT) {
    errors.last_name = minimumCharactersError(NAME_CHARACTER_LIMIT)
  }

  if (!isValidEmail(email)) {
    errors.email = 'Invalid email address.'
  }

  const socials = {
    website,
    facebook,
    twitter,
    instagram,
    linkedin,
    youtube
  }

  Object.entries(socials).forEach(([name, value]) => {
    if (value && !isValidURL(value)) {
      errors[name] = `Invalid ${name} URL!`
    }
  })

  return errors
}

export default compose(
  connect(
    ({ brand, user }) => {
      const {
        first_name,
        last_name,
        email,
        phone_number,
        website,
        instagram,
        facebook,
        linkedin,
        youtube,
        twitter
      } = user

      const cleanURL = url => {
        if (!url) {
          return ''
        }

        if (url.startsWith('http')) {
          if (url.startsWith('https://')) {
            return url
          }

          return url.replace('http://', 'https://')
        }

        return `https://${url}`
      }

      return {
        brand,
        user,
        initialValues: {
          email,
          last_name,
          first_name,
          phone_number: phone_number || '',
          website: cleanURL(website),
          instagram: cleanURL(instagram),
          facebook: cleanURL(facebook),
          linkedin: cleanURL(linkedin),
          youtube: cleanURL(youtube),
          twitter: cleanURL(twitter)
        }
      }
    },
    { editUser }
  ),
  reduxForm({
    form: 'personal_info',
    validate
  }),
  withState('submitError', 'setSubmitError', ''),
  withState('isSubmitting', 'setIsSubmitting', false),
  withState('submitSuccessfully', 'setSubmitSuccessfully', false),
  withHandlers({
    onSubmitHandler:
      ({
        editUser,
        initialValues,
        setSubmitError,
        setIsSubmitting,
        setSubmitSuccessfully
      }) =>
      async fields => {
        setSubmitError('')

        const userInfo = {}

        try {
          if (!fields.email) {
            throw new Error('Email fields could not be empty!')
          }

          Object.keys(fields).forEach(field => {
            if (initialValues[field] !== fields[field]) {
              if (field === 'phone_number' && !fields.phone_number) {
                userInfo.phone_number = null

                return
              }

              userInfo[field] = fields[field]
            }
          })

          if (Object.keys(userInfo).length > 0) {
            setIsSubmitting(true)

            const user = await editUser(userInfo)

            if (user instanceof Error) {
              throw user
            }

            setIsSubmitting(false)
            setSubmitSuccessfully(true)
            setTimeout(() => setSubmitSuccessfully(false), 3000)
          }
        } catch ({ message, response }) {
          let errorMessage = 'An unexpected error occurred. Please try again.'

          if (message && message !== 'Conflict') {
            errorMessage = message
          }

          if (response && response.body.message) {
            errorMessage = response.body.message
          }

          setIsSubmitting(false)
          setSubmitError(errorMessage)
        }
      }
  })
)(PersonalInfoForm)
