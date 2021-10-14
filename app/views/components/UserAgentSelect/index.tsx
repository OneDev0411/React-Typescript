import { useState } from 'react'

import {
  Box,
  Chip,
  makeStyles,
  Radio,
  Theme,
  Typography
} from '@material-ui/core'
import cn from 'classnames'

const useStyles = makeStyles(
  (theme: Theme) => ({
    row: {
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1.5)
    },
    status: {
      display: 'inline-block',
      width: theme.spacing(1.5),
      height: theme.spacing(1.5),
      marginRight: theme.spacing(1),
      borderRadius: '100%',
      background: theme.palette.warning.main,
      '&.Active': {
        background: theme.palette.success.main
      }
    }
  }),
  {
    name: 'UserAgentSelect'
  }
)

interface Props {
  defaultAgent?: UUID
  agents: Nullable<IAgent[]>
  onChange: (agent: IAgent) => void
}

export function UserAgentSelect({ agents, defaultAgent, onChange }: Props) {
  const classes = useStyles()
  const [selectedAgent, setSelectedAgent] = useState(defaultAgent)

  const handleSelectAgent = (agent: IAgent) => {
    setSelectedAgent(agent.id)
    onChange(agent)
  }

  if (!Array.isArray(agents)) {
    return null
  }

  return (
    <Box>
      {agents.map(agent => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.row}
          key={agent.id}
        >
          <Box display="flex" alignItems="center">
            <Radio
              color="primary"
              checked={selectedAgent === agent.id}
              onClick={() => handleSelectAgent(agent)}
            />

            <Box ml={2}>
              <Typography variant="body2">{agent.mls}</Typography>

              <Typography variant="body2" color="textSecondary">
                {agent.mlsid} . {agent.office?.name}
              </Typography>
            </Box>
          </Box>

          <div>
            <Chip
              variant="outlined"
              label={
                <Box display="flex" alignItems="center">
                  <span className={cn(classes.status, agent.status)} />{' '}
                  <Typography variant="body2">{agent.status}</Typography>
                </Box>
              }
            />
          </div>
        </Box>
      ))}
    </Box>
  )
}
