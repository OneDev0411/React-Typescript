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
  user: IUser
  onClose: () => void
}

export function AddMlsAgent({ user, isOpen, onClose }: Props) {
  const notify = useNotify()
  const [agent, setAgent] = useState<Nullable<IAgent>>(null)
  const [agents, setAgents] = useState<IAgent[]>([])

  const getHeadings = () => {
    if (agents.length == 0) {
      return {
        title: 'Agent Verification',
        subtitle: 'Enter your agent license # to unlock MLS features.'
      }
    }

    if (agents.length > 0 && !agent) {
      return {
        title: 'Choose MLS',
        subtitle: 'Choose which MLS you are in.'
      }
    }

    return {
      title: 'Agent Verification',
      subtitle: 'Enter the complete mobile number or email address.'
    }
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

  const handleClose = () => {
    setAgents([])
    setAgent(null)
    onClose()
  }

  const headings = getHeadings()

  return (
    <Dialog open={isOpen} fullWidth maxWidth="xs">
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="h6">{headings.title}</Typography>
            <Typography variant="subtitle2">{headings.subtitle}</Typography>
          </div>
          <IconButton onClick={handleClose}>
            <SvgIcon path={mdiClose} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box display="flex" flexDirection="column" my={2}>
          {agents.length === 0 && (
            <SearchAgent user={user} onComplete={onSearchAgentComplete} />
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
