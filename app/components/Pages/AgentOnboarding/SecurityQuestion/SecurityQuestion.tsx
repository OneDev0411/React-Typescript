import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { browserHistory, Link, WithRouterProps } from 'react-router'
import { Helmet } from 'react-helmet'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import { IAppState } from 'reducers'
import { updateUser } from 'actions/user'
import { upgradeAgent } from 'models/user/upgrade-to-agent'

import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Header from '../Header'
import Container from '../Container'
import SkipButton from '../SkipButton'
import NextButton from '../NextButton'
import { useCommonStyles } from '../common-styles'

interface FormValues {
  secret: string
}

export function SecurityQuestion(props: WithRouterProps) {
  const dispatch = useDispatch()
  const commonClasses = useCommonStyles({})
  const brand: IBrand = useSelector((store: IAppState) => store.brand)
  const agent: IAgent = props.location.state.agent

  const onSubmit = async (values: FormValues) => {
    try {
      const user = await upgradeAgent({
        agent: agent.id,
        secret: values.secret
      })

      if (user) {
        dispatch(updateUser(user))

        browserHistory.push('/onboarding/config-brand')
      }
    } catch (error) {
      return {
        [FORM_ERROR]:
          error.response.body.message ||
          'There was an error with this request. Please try again.'
      }
    }
  }

  const validate = ({ secret }: FormValues) => {
    secret = secret && secret.trim()

    if (!secret) {
      return { secret: 'Required!' }
    }

    return {}
  }

  return (
    <>
      <Helmet>
        <title>Confirm Contact Info| Onboarding | Rechat</title>
      </Helmet>

      <Container>
        <SkipButton to="/onboarding/config-brand" />
        <Header
          brand={brand}
          title="Agent Verification"
          subtitle="Enter the complete mobile number or email address."
        />

        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, form }) => {
            const { submitError, submitting } = form.getState()

            return (
              <form onSubmit={handleSubmit}>
                <Box mb={5}>
                  <Box mb={5} textAlign="left">
                    <Field
                      component={MUITextInput}
                      id="secret"
                      label="Security Question"
                      placeholder={agent.secret_questions.join(' or ')}
                      name="secret"
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
                </Box>
              </form>
            )
          }}
        />

        <Link to="/onboarding/confirm-agent-id">
          Try again with a new agent license!
        </Link>
      </Container>
    </>
  )
}
