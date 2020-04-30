import React, { useCallback } from 'react'
import { FORM_ERROR } from 'final-form'
import { browserHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { getActiveBrand } from 'utils/user-teams'

import { IAppState } from 'reducers'

import { addBrand } from 'models/BrandConsole/Brands'
import { getTeams } from 'models/user/get-teams'
import { updateUser } from 'actions/user'
import getVerificationCode from 'models/verify/request'

import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import Container from '../Container'
import { useDocumentTitle } from '../use-document-title'
import { useCommonStyles } from '../common-styles'

interface FormValues {
  name: string
}

export function ConfigBrand() {
  useDocumentTitle('Config Brand')

  const dispatch = useDispatch()
  const commonClasses = useCommonStyles()
  const user: IUser = useSelector((store: IAppState) => store.user)
  const activeBrand = getActiveBrand(user)

  const getNextStep = useCallback(() => {
    let nextStepUrl = 'oauth-accounts'

    if (!user.phone_number) {
      nextStepUrl = 'phone-number'
    } else if (!user.phone_confirmed) {
      getVerificationCode('phone')
      nextStepUrl = `verify-phone-number?pn=${window.encodeURIComponent(
        user.phone_number
      )}`
    }

    return `/onboarding/${nextStepUrl}`
  }, [user.phone_number, user.phone_confirmed])

  const onSubmit = async (values: FormValues) => {
    try {
      const parentBrand = await addBrand(
        {
          name: values.name,
          brand_type: 'Brokerage'
        },
        null,
        [
          {
            role: 'Admin',
            acl: ['Admin', 'Marketing'],
            members: [{ user: user.id }]
          }
        ]
      )

      await addBrand(
        {
          name: `${user.first_name}'s Team`,
          brand_type: 'Personal'
        },
        parentBrand.data.id,
        [
          {
            role: 'Agent',
            acl: ['CRM', 'Marketing'],
            members: [{ user: user.id }]
          }
        ]
      )

      const teams = await getTeams(user)

      dispatch(
        updateUser({
          ...user,
          teams
        })
      )

      browserHistory.push(getNextStep())
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

  const validate = ({ name }: FormValues) => {
    name = name && name.trim()

    if (!name) {
      return { name: 'Required!' }
    }

    return {}
  }

  if (activeBrand) {
    browserHistory.push(getNextStep())

    return null
  }

  return (
    <Container>
      <SkipButton to="/onboarding/oauth-accounts" />
      <Header
        brand={activeBrand}
        title="Config Your Brand"
        subtitle="We use these information to set up your brand."
      />

      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit}>
              <Box mb={5}>
                <Field
                  component={MUITextInput}
                  id="name"
                  label="Brand Name"
                  name="name"
                  variant="filled"
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
