import { useState } from 'react'

import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  makeStyles
} from '@material-ui/core'
import useControllableState from 'react-use-controllable-state'

import useTeamAgentsSearch from '@app/views/components/TeamAgents/use-team-agents-search'

import AgentSearchInputResultItem from './AgentSearchInputResultItem'

const useStyles = makeStyles(
  theme => ({
    root: {
      maxHeight: '70vh',
      overflow: 'auto'
    },
    searchInputContainer: {
      backgroundColor: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      marginBottom: theme.spacing(2)
    }
  }),
  { name: 'AgentSearchInput' }
)

export interface AgentSearchInputProps {
  placeholder?: string
  autoFocus?: boolean
  defaultValue?: IUser
  value?: IUser
  onChange: (agent: IUser) => void
  options: IBrand[]
  flattenTeams?: boolean
  isLoading?: boolean
}

function AgentSearchInput({
  placeholder = 'Search Agent',
  autoFocus,
  options,
  flattenTeams = false,
  onChange,
  defaultValue,
  value,
  isLoading = false
}: AgentSearchInputProps) {
  const classes = useStyles()
  const [searchCriteria, setSearchCriteria] = useState('')

  const [agentValue, setAgentValue] = useControllableState(
    value,
    onChange,
    defaultValue
  )
  const teams = useTeamAgentsSearch(options, searchCriteria, flattenTeams)

  if (isLoading) {
    return <CircularProgress disableShrink />
  }

  return (
    <div className={classes.root}>
      <Box className={classes.searchInputContainer}>
        <TextField
          fullWidth
          variant="outlined"
          onChange={e => setSearchCriteria(e.target.value)}
          placeholder={placeholder}
          size="small"
          autoFocus={autoFocus}
        />
      </Box>
      {teams.map((team, index) => (
        <div key={index}>
          {teams.length > 1 && (
            <Box ml={1} my={1}>
              <Typography variant="subtitle2">{team.name}</Typography>
              <Typography variant="caption">{team.subtitle}</Typography>
            </Box>
          )}
          {team.users.map(agent => (
            <AgentSearchInputResultItem
              key={agent.id}
              name={agent.display_name}
              email={agent.email}
              avatarUrl={agent.profile_image_url!}
              onClick={() => setAgentValue(agent)}
              selected={agentValue?.id === agent.id}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default AgentSearchInput
