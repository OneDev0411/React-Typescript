import { useMemo, useState } from 'react'

import {
  FormControl,
  Select,
  Box,
  Button,
  MenuItem,
  Link,
  FormHelperText
} from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectUserAgents } from '@app/selectors/user'

interface Props {
  agents: IAgent[]
  onSelectAgent: (agent: IAgent) => void
  onRemoveAgentNumber: () => void
}

export function SelectAgent({
  agents,
  onSelectAgent,
  onRemoveAgentNumber
}: Props) {
  const [selectedId, setSelectedId] = useState('')
  const userAgents = useSelector(selectUserAgents)

  const handleNext = () => {
    if (!selectedId) {
      return
    }

    onSelectAgent(agents.find(agent => agent.id === selectedId)!)
  }

  const list = useMemo(
    () =>
      agents.map(item => ({
        value: item.id,
        label: `${item.mls} ${item.full_name ? ` - ${item.full_name}` : ''}`,
        disabled:
          userAgents?.some(
            userAgent => userAgent.mls === item.mls && userAgent.id === item.id
          ) || false
      })),
    [agents, userAgents]
  )

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <FormControl fullWidth size="small">
        <Select
          fullWidth
          displayEmpty
          variant="outlined"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value as string)}
        >
          <MenuItem disabled value="">
            -- Select --
          </MenuItem>

          {list.map((item, key) => (
            <MenuItem key={key} value={item.value} disabled={item.disabled}>
              {item.label}
              {item.disabled && <FormHelperText>[Selected]</FormHelperText>}
            </MenuItem>
          ))}
        </Select>

        <FormHelperText variant="standard">
          <span>Couldn't find your MLS in here? Send us an email to </span>
          <Link
            target="_blank"
            color="secondary"
            href="mailto:support@rechat.com"
          >
            support@rechat.com
          </Link>
          <span> and we'll activate your account for you.</span>
        </FormHelperText>
      </FormControl>

      <Box display="flex" mt={2}>
        <Box mr={1}>
          <Button size="small" onClick={onRemoveAgentNumber}>
            Back
          </Button>
        </Box>

        <Button
          size="small"
          color="primary"
          variant="contained"
          disabled={!selectedId}
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}
