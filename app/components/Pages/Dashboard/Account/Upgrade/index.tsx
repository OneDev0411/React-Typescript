import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import searchAgent from 'models/agent/search'

import SecretQuestionModal from './components/SecretQuestionModal'

function AgentConfirm(props) {
  const [agent, setAgent] = useState<null | IAgent>(null)
  const [mlsid, setMlsid] = useState('')
  const [upgradeError, setUpgradeError] = useState(0)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [confirmModalIsActive, setConfirmModalActive] = useState(false)
  const { redirectTo = '/dashboard/account' } = props.location.query

  const onChange = e => {
    const newValue = e.target.value

    setMlsid(newValue)

    if (upgradeError && newValue) {
      setUpgradeError(0)
    }
  }

  const onUpgradeHandler = async event => {
    event.preventDefault()

    if (!mlsid) {
      return
    }

    setIsUpgrading(true)

    try {
      const agent = await searchAgent(mlsid)

      setAgent(agent)
      setIsUpgrading(false)
      setConfirmModalActive(true)
    } catch (errorCode) {
      setIsUpgrading(false)
      setUpgradeError(errorCode)
    }
  }

  return (
    <>
      <Helmet>
        <title>Upgrade Account | Settings | Rechat </title>
      </Helmet>

      <Container maxWidth="sm">
        <Box textAlign="center" pt={3} pb={6}>
          <Typography variant="h4"> Upgrade to agent account </Typography>
        </Box>
        <Box>
          <form onSubmit={onUpgradeHandler}>
            <Box mb={2}>
              <Typography variant="subtitle2">
                Enter your agent license # to unlock MLS features.
              </Typography>
              <TextField
                id="mlsid"
                color="secondary"
                label="MLS ID"
                placeholder="xxxxx"
                onChange={onChange}
                variant="filled"
              />
            </Box>
            {upgradeError > 0 && (
              <Box mb={2}>
                <Alert severity="error">
                  {upgradeError === 404
                    ? `Agent corresponding to this MLS ID (${mlsid}) not found!`
                    : 'There was an error with this request. Please try again.'}
                </Alert>
              </Box>
            )}
            <Button
              type="submit"
              disabled={isUpgrading}
              variant="contained"
              color="secondary"
            >
              {isUpgrading ? 'Searching...' : 'Upgrade'}
            </Button>
          </form>
        </Box>
      </Container>
      {agent && (
        <SecretQuestionModal
          show={confirmModalIsActive}
          onHide={() => setConfirmModalActive(false)}
          mlsid={mlsid}
          agent={agent.id}
          redirectTo={redirectTo}
          question={agent.secret_questions[0]}
        />
      )}
    </>
  )
}

export default AgentConfirm
