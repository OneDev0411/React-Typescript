import { useState } from 'react'

import {
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import useNotify from '@app/hooks/use-notify'

import { SvgIcon } from '../SvgIcons/SvgIcon'

import { SearchAgent } from './SearchAgent'
import { SecurityQuestion } from './SecurityQuestion'
import { SelectAgent } from './SelectAgent'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function AddMlsAgent({ isOpen, onClose }: Props) {
  const notify = useNotify()
  const [agent, setAgent] = useState<Nullable<IAgent>>(null)
  const [agents, setAgents] = useState<IAgent[]>([])

  const getTitle = () => {
    if (agents.length == 0) {
      return 'Enter your agent license number.'
    }

    if (agents.length > 0 && !agent) {
      return 'Select MLS.'
    }

    return 'Agent Verification.'
  }

  const onSearchAgentComplete = (agents: IAgent[]) => {
    setAgents(agents)
  }

  const handleRemoveAgentNumber = () => {
    setAgents([])
  }

  const onComplete = () => {
    setAgents([])
    setAgent(null)

    notify({
      status: 'success',
      message: 'The process was successfully completed.'
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} fullWidth maxWidth="xs" onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{getTitle()}</Typography>
          <IconButton onClick={onClose}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box display="flex" flexDirection="column" my={2}>
          {agents.length === 0 && (
            <SearchAgent onComplete={onSearchAgentComplete} />
          )}
          {agents.length > 0 && !agent && (
            <SelectAgent
              agents={agents}
              onSelectAgent={setAgent}
              onRemoveAgentNumber={handleRemoveAgentNumber}
            />
          )}
          {agent && (
            <SecurityQuestion
              agent={agent}
              onRemoveAgent={() => setAgent(null)}
              onComplete={onComplete}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
