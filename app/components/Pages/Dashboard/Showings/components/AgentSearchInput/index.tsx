import { useState } from 'react'

import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  makeStyles
} from '@material-ui/core'

import useTeamAgentsSearch from '@app/views/components/TeamAgents/use-team-agents-search'
import { UserAgentSelect } from '@app/views/components/UserAgentSelect'

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
  onChange: (user: IUser, selectedAgent?: IAgent) => void
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
  const [selectedUser, setSelectedUser] = useState<Optional<IUser>>(
    value ?? defaultValue
  )
  const [isAgentMlsSelectOpen, setIsAgentMlsSelectOpen] =
    useState<boolean>(false)

  const teams = useTeamAgentsSearch(options, searchCriteria, flattenTeams)

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user)

    const hasMultipleAgents = user.agents?.length && user.agents.length > 1

    if (hasMultipleAgents) {
      setIsAgentMlsSelectOpen(true)

      return
    }

    const selectedAgent = user.agents?.[0] ?? undefined

    onChange(user, selectedAgent)
  }

  const handleSelectAgent = (selectedAgent: IAgent) => {
    if (!selectedUser) {
      return
    }

    onChange(selectedUser, selectedAgent)
  }

  const handleClickOnBackToAgentsList = () => {
    setIsAgentMlsSelectOpen(false)
  }

  if (isLoading) {
    return <CircularProgress disableShrink />
  }

  if (isAgentMlsSelectOpen && !!selectedUser) {
    return (
      <div className={classes.root}>
        <Box mb={1}>
          <Typography variant="body1">Select MLS</Typography>
        </Box>
        <UserAgentSelect
          agents={selectedUser.agents}
          onChange={handleSelectAgent}
        />
        <Box mt={2} display="flex" flexDirection="row-reverse">
          <Button
            size="small"
            variant="outlined"
            onClick={handleClickOnBackToAgentsList}
          >
            Back To Agents List
          </Button>
        </Box>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <Box className={classes.searchInputContainer}>
        <TextField
          fullWidth
          variant="outlined"
          value={searchCriteria}
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
          {team.users.map(user => (
            <AgentSearchInputResultItem
              key={user.id}
              name={user.display_name}
              email={user.email}
              avatarUrl={user.profile_image_url!}
              onClick={() => handleSelectUser(user)}
              selected={selectedUser?.id === user.id}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default AgentSearchInput
