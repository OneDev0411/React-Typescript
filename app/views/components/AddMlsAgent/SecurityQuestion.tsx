import { useState } from 'react'

import { Box, Button, Typography, TextField } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import upgradeAgent from '@app/models/user/upgrade-to-agent'
import { updateUser } from '@app/store_actions/user'

interface Props {
  agent: IAgent
  onRemoveAgent: () => void
  onComplete: () => void
}

export function SecurityQuestion({ agent, onRemoveAgent, onComplete }: Props) {
  const dispatch = useDispatch()

  const [isWorking, setIsWorking] = useState(false)
  const [securityValue, setSecurityValue] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    try {
      setIsWorking(true)

      const user = await upgradeAgent({
        agent: agent.id,
        secret: securityValue
      })

      user && dispatch(updateUser(user))

      setIsWorking(false)
      onComplete()
    } catch (error) {
      setIsWorking(false)
      setSecurityValue('')
      setError(
        error.response.body.message ||
          'There was an error with this request. Please try again.'
      )
    }
  }

  return (
    <>
      <Box mb={2}>
        <Typography variant="body2" display="block" color="textSecondary">
          Hint:
        </Typography>
        {agent?.secret_questions.map((question, index) => (
          <Typography key={index} display="block" variant="subtitle1">
            {question}
          </Typography>
        ))}
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          value={securityValue}
          label="Security Question"
          placeholder="Enter full phone or email shown above"
          variant="outlined"
          size="small"
          error={!!error}
          helperText={error}
          onChange={e => setSecurityValue(e.target.value)}
        />

        <Box display="flex" mt={2}>
          <Box mr={1}>
            <Button size="small" onClick={onRemoveAgent}>
              Back
            </Button>
          </Box>

          <Button
            size="small"
            color="primary"
            variant="contained"
            disabled={!securityValue || isWorking}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </>
  )
}
