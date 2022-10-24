import { ChangeEvent, useState } from 'react'

import {
  Box,
  Button,
  Container,
  Typography,
  TextField
} from '@material-ui/core'
import { useTitle } from 'react-use'

import searchAgent from 'models/agent/search'

import SecretQuestionModal from './SecretQuestionModal/index'

export function AgentConfirm() {
  useTitle('Upgrade to agent | Settings | Rechat')

  const [agentNumber, setAgentNumber] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [agents, setAgents] = useState<IAgent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setError('')
    setIsSearching(true)

    try {
      const agents = await searchAgent({ mlsid: agentNumber.trim() })

      setIsSearching(false)

      if (agents.length === 0) {
        setError(
          `We were not able to find an agent matching MLS ID "${agentNumber}".`
        )

        return
      }

      setAgents(agents)
      setIsModalOpen(true)
    } catch (e) {
      setIsSearching(false)
      setError('There was an error with this request. Please try again.')
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAgentNumber(e.target.value)

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

        <Typography variant="subtitle2">
          Enter your agent license # to unlock MLS features.
        </Typography>
        <Box mb={2} width="50%">
          <TextField
            autoFocus
            fullWidth
            value={agentNumber}
            label="Agent Number"
            placeholder="xxxxxx"
            variant="filled"
            size="small"
            color="secondary"
            error={!!error}
            helperText={error}
            onChange={onChange}
          />
        </Box>
        <Button
          disabled={isSearching || agentNumber.trim().length === 0}
          variant="contained"
          color="secondary"
          onClick={handleSearch}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </Container>
      <SecretQuestionModal
        isOpen={isModalOpen}
        mlsId={agentNumber}
        agents={agents}
        onHide={() => setIsModalOpen(false)}
      />
    </>
  )
}
