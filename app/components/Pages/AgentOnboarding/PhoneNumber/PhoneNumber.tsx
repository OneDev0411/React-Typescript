import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { useDispatch } from 'react-redux'
import { browserHistory, WithRouterProps } from 'react-router'

import { updateUser } from 'actions/user'
import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { editUser } from 'models/user/edit'
import { formatPhoneNumber } from 'utils/format'
import { isPhoneNumber } from 'utils/validations'

import { useCommonStyles } from '../common-styles'
import Container from '../Container'
import Header from '../Header'
import NextButton from '../NextButton'
import SkipButton from '../SkipButton'
import { useDocumentTitle } from '../use-document-title'

interface FormValues {
  phone_number: string | undefined
}

export function PhoneNumber({ location }: WithRouterProps) {
  useDocumentTitle('Phone Number')

  const dispatch = useDispatch()
  const commonClasses = useCommonStyles()
  const phoneNumber = window.decodeURIComponent(location.query.pn || '')

  const onSubmit = async (values: FormValues) => {
    try {
      const isInvalidPhone = await isPhoneNumber(values.phone_number)

      if (isInvalidPhone) {
        throw new Error(isInvalidPhone)
      }

      const user = await editUser(values)

      dispatch(updateUser(user))
      browserHistory.push(
        `/onboarding/verify-phone-number?pn=${window.encodeURIComponent(
          user.phone_number
        )}`
      )
    } catch (error) {
      let message = 'Something went wrong. Please try again.'

      if (typeof error === 'string') {
        message = error
      } else if (error.message === 'Conflict') {
        message =
          // eslint-disable-next-line max-len
          'This number is verified by a current user, please check your number and try again.'
      } else if (error.message) {
        message = error.message
      }

      return { [FORM_ERROR]: message }
    }
  }

  const validate = ({ phone_number }: FormValues) => {
    phone_number = phone_number && phone_number.trim()

    if (!phone_number) {
      return { phone_number: 'Required!' }
    }

    return {}
  }

  return (
    <Container>
      <SkipButton to="/onboarding/oauth-accounts" />
      <Header
        title="Verify Phone Number"
        subtitle="We will not share your number with anyone"
      />

      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{ phone_number: formatPhoneNumber(phoneNumber) }}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit}>
              <Box mb={5}>
                <Field
                  component={MUITextInput}
                  id="phone-number"
                  label="US Phone number"
                  name="phone_number"
                  variant="filled"
                  formatOnBlur
                  format={formatPhoneNumber}
                  classes={{ root: commonClasses.field }}
                />
                {submitError && !submitting && (
                  <Box mt={3}>
                    <Alert severity="error">{submitError}</Alert>
                  </Box>
                )}
              </Box>

              {submitting ? (
                <CircleSpinner />
              ) : (
                <NextButton type="submit" disabled={submitting} />
              )}
            </form>
          )
        }}
      />
    </Container>
  )
}
