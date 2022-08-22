import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { WithRouterProps } from 'react-router'

import { MUITextInput } from 'components/Forms/MUITextInput'
import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import searchAgent from 'models/agent/search'

import { useCommonStyles } from '../common-styles'
import Container from '../Container'
import Header from '../Header'
import NextButton from '../NextButton'
import SkipButton from '../SkipButton'
import { useDocumentTitle } from '../use-document-title'

interface FormValues {
  mlsId: string
}

export default function ConfirmAgentId(props: WithRouterProps) {
  useDocumentTitle('Confirm Agent ID')

  const commonClasses = useCommonStyles()
  const mlsId = props.location.query.mlsId

  const onSubmit = async (values: FormValues) => {
    const notFoundError = {
      // eslint-disable-next-line max-len
      [FORM_ERROR]: `We were not able to find an agent matching MLS ID (${values.mlsId})). You can go back to try a different number or skip this step for now.`
    }

    try {
      const agents = await searchAgent(values.mlsId)

      if (agents.length === 0) {
        return notFoundError
      }

      props.router.push({
        pathname: '/onboarding/confirm-agent-id/choose-mls',
        query: { mlsId: values.mlsId },
        state: { agents }
      })
    } catch (errorCode) {
      if (errorCode === 404) {
        return notFoundError
      }

      return {
        [FORM_ERROR]: 'There was an error with this request. Please try again.'
      }
    }
  }

  const validate = ({ mlsId }: FormValues) => {
    mlsId = mlsId && mlsId.trim()

    if (!mlsId) {
      return { mlsId: 'Required!' }
    }

    return {}
  }

  return (
    <Container>
      <SkipButton to="/onboarding/config-brand" />
      <Header
        title="Agent Verification"
        subtitle="Enter your agent license # to unlock MLS features."
      />

      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={{ mlsId }}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit}>
              <Box mb={5}>
                <Box mb={5}>
                  <Field
                    component={MUITextInput}
                    id="mlsId"
                    label="Agent Number"
                    placeholder="xxxxxx"
                    name="mlsId"
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
    </Container>
  )
}
