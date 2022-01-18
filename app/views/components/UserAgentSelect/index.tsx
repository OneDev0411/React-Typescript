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

import { TextMiddleTruncate } from '../TextMiddleTruncate'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '& $row:not(:last-child)': {
        marginBottom: theme.spacing(1)
      }
    },
    row: {
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      padding: theme.spacing(0.5, 1.5),
      cursor: 'pointer',
      '&.selected': {
        backgroundColor: theme.palette.grey['100']
      }
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
    <Box className={classes.root} width="100%">
      {agents.map(agent => (
        <Box
          key={agent.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={cn(classes.row, {
            selected: selectedAgent === agent.id
          })}
          onClick={() => handleSelectAgent(agent)}
        >
          <Box display="flex" alignItems="center">
            <Radio color="primary" checked={selectedAgent === agent.id} />

            <Box ml={2}>
              <Typography variant="body2">{agent.mls}</Typography>

              <Typography variant="body2" color="textSecondary">
                {agent.mlsid} {' . '}
                {agent.office?.name && (
                  <TextMiddleTruncate text={agent.office.name} maxLength={20} />
                )}
              </Typography>
            </Box>
          </Box>

          <div>
            <Chip
              variant="outlined"
              label={
                <Box display="flex" alignItems="center">
                  <span className={cn(classes.status, agent.status)} />{' '}
                  <Typography variant="body2">
                    {agent.status || 'Unknown'}
                  </Typography>
                </Box>
              }
            />
          </div>
        </Box>
      ))}
    </Box>
  )
}
