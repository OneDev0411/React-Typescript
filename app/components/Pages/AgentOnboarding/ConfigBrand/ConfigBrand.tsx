import { useCallback } from 'react'

import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory } from 'react-router'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { setActiveTeam } from '@app/store_actions/active-team'
import { updateUser } from 'actions/user'
import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { addBrand } from 'models/BrandConsole/Brands'
import { getTeams } from 'models/user/get-teams'
import { putUserSetting } from 'models/user/put-user-setting'
import getVerificationCode from 'models/verify/request'
import { selectUser } from 'selectors/user'

import { useCommonStyles } from '../common-styles'
import Container from '../Container'
import Header from '../Header'
import NextButton from '../NextButton'
import { useDocumentTitle } from '../use-document-title'

interface FormValues {
  name: string
}

export function ConfigBrand() {
  useDocumentTitle('Config Brand')

  const dispatch = useDispatch()
  const commonClasses = useCommonStyles()
  const user = useSelector(selectUser)
  const activeBrand = useUnsafeActiveBrand()

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

      const teams = await getTeams()
      const personalTeam = teams.find(
        team => team.brand.brand_type === 'Personal'
      )

      if (personalTeam) {
        await putUserSetting('user_filter', [], personalTeam.brand.id)

        dispatch(setActiveTeam(personalTeam))

        dispatch(
          updateUser({
            ...user,
            active_brand: personalTeam.brand.id,
            brand: personalTeam.brand.id
          })
        )
      }

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
      <Header
        title="Enter Brokerage or Brand Name"
        subtitle="We use this information to set up your brand."
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
                  label="Brokerage or Brand Name"
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
