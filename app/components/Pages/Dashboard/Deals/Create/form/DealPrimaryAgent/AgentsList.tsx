import React, { useState } from 'react'

import {
  Box,
  TextField,
  makeStyles,
  Theme,
  CircularProgress
} from '@material-ui/core'

import TeamAgents from 'components/TeamAgents'

import { convertUserAgentToRole } from '../../helpers/convert-user-to-role'

import { UserRow } from '../../components/UserRow'

import { IDealFormRole } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      maxHeight: '40vh',
      overflow: 'auto'
    },
    selectedAgent: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0.5, 0.5, 0)
    },
    searchInput: {
      padding: theme.spacing(1.5)
    },
    continueButton: {
      margin: theme.spacing(2, 0)
    },
    searchInputContainer: {
      backgroundColor: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1
    }
  }),
  {
    name: 'CreateDeal-PrimaryAgent'
  }
)

interface Props {
  onSelectRole: (role: Partial<IDealFormRole>) => void
}

export function AgentsList({ onSelectRole }: Props) {
  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useState<string>('')

  return (
    <TeamAgents flattenTeams isPrimaryAgent criteria={searchCriteria}>
      {({ teams, isLoading }) =>
        isLoading ? (
          <CircularProgress disableShrink />
        ) : (
          <div className={classes.root}>
            <Box className={classes.searchInputContainer}>
              <TextField
                fullWidth
                onChange={e => setSearchCriteria(e.target.value)}
                placeholder="Search Agents"
                size="medium"
                className={classes.searchInput}
              />
            </Box>

            {teams.map((team, index) => (
              <div key={index}>
                {team.users.map(agent => (
                  <UserRow
                    key={agent.id}
                    name={agent.display_name}
                    email={agent.email}
                    avatarUrl={agent.profile_image_url!}
                    onClick={() => onSelectRole(convertUserAgentToRole(agent))}
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
