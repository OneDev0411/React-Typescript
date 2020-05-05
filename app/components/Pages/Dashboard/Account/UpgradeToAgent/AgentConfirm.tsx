import React, { useState } from 'react'
import { useTitle } from 'react-use'
import { FORM_ERROR } from 'final-form'
import { Form, Field } from 'react-final-form'
import { Alert } from '@material-ui/lab'
import { Box, Button, Container, Typography } from '@material-ui/core'

import searchAgent from 'models/agent/search'
import { MUITextInput } from 'components/Forms/MUITextInput'

import SecretQuestionModal from './SecretQuestionModal/index'

export function AgentConfirm() {
  useTitle('Upgrade to agent | Settings | Rechat')

  const [mlsId, setMlsId] = useState('')
  const [agents, setAgents] = useState<IAgent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onSubmit = async values => {
    setMlsId(values.mlsId)

    try {
      const agents = await searchAgent(values.mlsId)

      setAgents(agents)
      setIsModalOpen(true)
    } catch (errorCode) {
      if (errorCode === 404) {
        return {
          [FORM_ERROR]: `Agent corresponding to this MLS ID (${
            values.mlsId
          }) not found!`
        }
      }

      return {
        [FORM_ERROR]: 'There was an error with this request. Please try again.'
      }
    }
  }

  const validate = ({ mlsId }: { mlsId: string }) => {
    mlsId = mlsId && mlsId.trim()

    if (!mlsId) {
      return { mlsId: 'Required!' }
    }

    return {}
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box textAlign="center" pt={3} pb={6}>
          <Typography variant="h4"> Upgrade to agent account </Typography>
        </Box>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, form }) => {
            const { submitError, submitting } = form.getState()

            return (
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
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
                  />
                </Box>
                {submitError && !submitting && (
                  <Box mt={3}>
                    <Alert severity="error">{submitError}</Alert>
                  </Box>
                )}
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="contained"
                  color="secondary"
                >
                  {submitting ? 'Searching...' : 'Search'}
                </Button>
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
