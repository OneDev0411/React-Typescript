import { useState } from 'react'

import { Box, Button, TextField } from '@material-ui/core'

import searchAgent from 'models/agent/search'

interface Props {
  onComplete: (agents: IAgent[]) => void
}

export function SearchAgent({ onComplete }: Props) {
  const [agentNumber, setAgentNumber] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setError('')
    setIsSearching(true)

    try {
      const agents = await searchAgent(agentNumber)

      setIsSearching(false)

      if (agents.length === 0) {
        setError(
          `We were not able to find an agent matching MLS ID "${agentNumber}".`
        )

        return
      }

      onComplete(agents)
    } catch (e) {
      setIsSearching(false)
      setError('There was an error with this request. Please try again.')
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        value={agentNumber}
        label="Agent Number"
        placeholder="xxxxxx"
        variant="outlined"
        size="small"
        error={!!error}
        helperText={error}
        onChange={e => setAgentNumber(e.target.value)}
      />

      <Box mt={2}>
        <Button
          size="small"
          color="primary"
          variant="contained"
          disabled={isSearching || agentNumber.trim().length === 0}
          onClick={handleSearch}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}
