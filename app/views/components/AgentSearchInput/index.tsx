import { useState } from 'react'

import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core'

import TeamAgents, { TeamAgentsProps } from 'components/TeamAgents'

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

interface AgentSearchInputProps
  extends Omit<TeamAgentsProps, 'children' | 'criteria'> {
  placeholder?: string
  autoFocus?: boolean
  defaultValue?: IUser
  value?: IUser
  onChange: (agent: IUser) => void
}

function AgentSearchInput({
  placeholder = 'Search Agent',
  autoFocus,
  isPrimaryAgent,
  flattenTeams,
  onChange,
  defaultValue,
  value: outValue
}: AgentSearchInputProps) {
  const classes = useStyles()
  const [searchCriteria, setSearchCriteria] = useState('')
  const [value, setValue] = useState<Nullable<IUser>>(defaultValue ?? null)
  const inputValue = outValue !== undefined ? outValue : value

  if (outValue !== undefined && !onChange) {
    throw new Error(
      'The onChange prop is required if you wanna use this component as controlled'
    )
  }

  const handleChange = (agent: IUser) => {
    // The value prop is undefined so the component must work uncontrolled
    if (outValue === undefined) {
      setValue(agent)
    }

    onChange(agent)
  }

  return (
    <TeamAgents
      flattenTeams={flattenTeams}
      isPrimaryAgent={isPrimaryAgent}
      criteria={searchCriteria}
    >
      {({ teams, isLoading }) =>
        isLoading ? (
          <CircularProgress disableShrink />
        ) : (
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
                    onClick={() => handleChange(agent)}
                    selected={inputValue?.id === agent.id}
                  />
                ))}
              </div>
            ))}
          </div>
        )
      }
    </TeamAgents>
  )
}

export default AgentSearchInput
