import { Box, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { useDispatch } from 'react-redux'
import { Link, WithRouterProps } from 'react-router'

import { updateUser } from 'actions/user'
import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { upgradeAgent } from 'models/user/upgrade-to-agent'

import { useCommonStyles } from '../common-styles'
import Container from '../Container'
import Header from '../Header'
import NextButton from '../NextButton'
import SkipButton from '../SkipButton'
import { useDocumentTitle } from '../use-document-title'

interface FormValues {
  secret: string
}

export function SecurityQuestion(props: WithRouterProps) {
  useDocumentTitle('Security Question')

  const dispatch = useDispatch()
  const commonClasses = useCommonStyles({})
  const agent: IAgent = props.location.state.agent

  const onSubmit = async (values: FormValues) => {
    try {
      const user = await upgradeAgent({
        agent: agent.id,
        secret: values.secret
      })

      if (user) {
        dispatch(updateUser(user))

        props.router.push('/onboarding/config-brand')
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
    <Container>
      <SkipButton to="/onboarding/config-brand" />
      <Header
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
              <Box textAlign="left" mb={2}>
                <Typography
                  variant="body2"
                  display="block"
                  color="textSecondary"
                >
                  Hint:
                </Typography>
                {agent.secret_questions.map((question, index) => (
                  <Typography key={index} display="block" variant="subtitle1">
                    {question}
                  </Typography>
                ))}
              </Box>

              <Box mb={5}>
                <Box mb={5} textAlign="left">
                  <Field
                    component={MUITextInput}
                    id="secret"
                    label="Enter full phone or email shown above"
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
  )
}
