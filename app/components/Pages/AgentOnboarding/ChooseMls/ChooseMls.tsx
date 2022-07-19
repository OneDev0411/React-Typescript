import { Box } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import idx from 'idx'
import { Form } from 'react-final-form'
import { WithRouterProps, Link } from 'react-router'

import CircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import Container from '../Container'
import Header from '../Header'
import NextButton from '../NextButton'
import SkipButton from '../SkipButton'
import { useDocumentTitle } from '../use-document-title'

import { MlsSelect } from './MlsSelect'

interface FormValues {
  agentId: UUID
}

export function ChooseMls(props: WithRouterProps) {
  useDocumentTitle('Confirm Agent ID')

  const agents: IAgent[] = idx(props, p => p.location.state.agents)
  const mlsId = props.location.query.mlsId

  if (!Array.isArray(agents) || agents.length === 0) {
    props.router.push('/oops')

    return null
  }

  const onSubmit = (values: FormValues) => {
    const agent = agents.find(a => a.id === values.agentId)

    if (!agent) {
      return
    }

    props.router.push({
      pathname: '/onboarding/confirm-agent-id/security-question',
      state: { agent }
    })
  }

  const defaultValue = '0000'
  const selectItems = [
    {
      name: '--Select--',
      value: defaultValue
    },
    ...agents.map(item => ({
      value: item.id,
      name: `${item.mls}${
        item.first_name || item.last_name
          ? ` - ${item.first_name} ${item.last_name}`
          : ''
      }`
    }))
  ]

  return (
    <Container>
      <SkipButton to="/onboarding/config-brand" />
      <Header
        title="Choose MLS"
        subtitle={`You entred ${mlsId} for MLS #, Choose which MLS you are in.`}
      />

      <Form
        onSubmit={onSubmit}
        initialValues={{ agentId: defaultValue }}
        render={({ handleSubmit, form }) => {
          const { submitError, submitting } = form.getState()

          return (
            <form onSubmit={handleSubmit}>
              <Box mb={5}>
                <Box mb={5}>
                  <MlsSelect items={selectItems} />
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

      <Link to={`/onboarding/confirm-agent-id?mlsId=${mlsId}`}>Back</Link>
    </Container>
  )
}
