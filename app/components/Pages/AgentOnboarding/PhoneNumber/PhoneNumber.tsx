import React from 'react'
import { FORM_ERROR } from 'final-form'
import { browserHistory, WithRouterProps } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { formatPhoneNumber } from 'utils/format'
import { isPhoneNumber } from 'utils/validations'

import { IAppState } from 'reducers'
import { updateUser } from 'actions/user'

import { editUser } from 'models/user/edit'

import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'
import { useCommonStyles } from '../common-styles'
import { useDocumentTitle } from '../use-document-title'

interface FormValues {
  phone_number: string | undefined
}

export function PhoneNumber({ location }: WithRouterProps) {
  useDocumentTitle('Phone Number')

  const dispatch = useDispatch()
  const commonClasses = useCommonStyles()
  const phoneNumber = window.decodeURIComponent(location.query.pn || '')
  const brand = useSelector((store: IAppState) => store.brand)

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
        brand={brand}
        title="Enter Phone Number"
        subtitle="We use your number to reach you and send important info"
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
