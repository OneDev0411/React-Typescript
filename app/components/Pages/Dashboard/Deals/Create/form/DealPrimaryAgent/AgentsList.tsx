import React, { useState } from 'react'

import {
  Box,
  TextField,
  makeStyles,
  Theme,
  CircularProgress,
  Typography
} from '@material-ui/core'

import TeamAgents from 'components/TeamAgents'

import { NormalizedBrand } from 'components/TeamAgents/types'

import { convertUserAgentToRole } from '../../helpers/convert-user-to-role'

import { UserRow } from '../../components/UserRow'

import { IDealFormRole } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      maxHeight: '70vh',
      overflow: 'auto'
    },
    selectedAgent: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0.5, 0.5, 0)
    },
    continueButton: {
      margin: theme.spacing(2, 0)
    },
    searchInputContainer: {
      backgroundColor: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      marginBottom: theme.spacing(2)
    }
  }),
  {
    name: 'CreateDeal-PrimaryAgent'
  }
)

interface Props {
  isOfficeDoubleEnded: boolean
  onSelectRole: (role: Partial<IDealFormRole>) => void
}

export function AgentsList({ isOfficeDoubleEnded, onSelectRole }: Props) {
  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useState<string>('')

  const getUsers = (teams: NormalizedBrand[]) => {
    if (searchCriteria.length >= 3) {
      return teams
    }

    if (isOfficeDoubleEnded) {
      return [
        {
          ...teams[0],
          users: teams[0].users.slice(0, 20)
        }
      ]
    }

    return teams.slice(0, 5)
  }

  return (
    <TeamAgents
      flattenTeams={isOfficeDoubleEnded}
      isPrimaryAgent={!isOfficeDoubleEnded}
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
                placeholder="Search Agents"
                size="small"
              />
            </Box>

            {getUsers(teams).map((team, index) => (
              <div key={index}>
                {(searchCriteria || teams.length > 1) && (
                  <Box ml={1} my={1}>
                    <Typography variant="subtitle2">{team.name}</Typography>
                    <Typography variant="caption">{team.subtitle}</Typography>
                  </Box>
                )}

                {team.users.map(agent => (
                  <UserRow
                    key={agent.id}
                    name={agent.display_name}
                    email={agent.email}
                    avatarUrl={agent.profile_image_url!}
                    onClick={() =>
                      onSelectRole(
                        convertUserAgentToRole({
                          ...agent,
                          brand_id: isOfficeDoubleEnded ? null : team.id
                        })
                      )
                    }
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
