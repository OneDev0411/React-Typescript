import { ChangeEvent, useState } from 'react'

import { Box, Button, Container, Typography } from '@material-ui/core'
import { Form, Field } from 'react-final-form'
import { useTitle } from 'react-use'

import { MUITextInput } from 'components/Forms/MUITextInput'
import searchAgent from 'models/agent/search'

import SecretQuestionModal from './SecretQuestionModal/index'

export function AgentConfirm() {
  useTitle('Upgrade to agent | Settings | Rechat')

  const [mlsId, setMlsId] = useState('')
  const [agents, setAgents] = useState<IAgent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async () => {
    setMlsId(mlsId)

    try {
      const agents = await searchAgent({ mlsid: mlsId.trim() })

      if (agents.length === 0) {
        setError(
          `We were not able to find an agent matching MLS ID "${mlsId}".`
        )

        return
      }

      setAgents(agents)
      setIsModalOpen(true)
    } catch (errorCode) {
      setError('There was an error with this request. Please try again.')
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setMlsId(value)

    if (error) {
      setError('')
    }
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box textAlign="center" pt={3} pb={6}>
          <Typography variant="h4"> Upgrade to agent account </Typography>
        </Box>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form }) => {
            const { submitting } = form.getState()

            return (
              <form onSubmit={handleSubmit}>
                <Box>
                  <Typography variant="subtitle2">
                    Enter your agent license # to unlock MLS features.
                  </Typography>

                  <Field
                    component={MUITextInput}
                    id="mlsId"
                    label="Agent Number"
                    placeholder="xxxxxx"
                    name="mlsId"
                    variant="filled"
                    input={{ onChange, value: mlsId }}
                  />
                </Box>
                {error && (
                  <Box ml={1}>
                    <Typography color="error" variant="caption">
                      {error}
                    </Typography>
                  </Box>
                )}
                <Box mt={2}>
                  <Button
                    type="submit"
                    disabled={submitting}
                    variant="contained"
                    color="secondary"
                  >
                    {submitting ? 'Searching...' : 'Search'}
                  </Button>
                </Box>
              </form>
            )
          }}
        />
      </Container>
      <SecretQuestionModal
        isOpen={isModalOpen}
        mlsId={mlsId}
        agents={agents}
        onHide={() => setIsModalOpen(false)}
      />
    </>
  )
}
