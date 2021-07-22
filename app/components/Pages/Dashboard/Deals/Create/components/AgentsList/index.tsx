import React, { useState } from 'react'

import {
  Box,
  TextField,
  makeStyles,
  Theme,
  CircularProgress,
  Paper
} from '@material-ui/core'
import AutoSizer from 'react-virtualized-auto-sizer'

import { NormalizedBrand } from '@app/views/components/TeamAgents/types'
import VirtualList from '@app/views/components/VirtualList'
import TeamAgents from 'components/TeamAgents'

import type { IDealFormRole } from '../../types'

import { Row, RowItem, RowType } from './Row'

const useStyles = makeStyles(
  (theme: Theme) => ({
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
  useTeamBrandId: boolean
  isPrimaryAgent: boolean
  flattenTeams: boolean
  onSelectRole: (role: Partial<IDealFormRole>) => void
}

export function AgentsList({
  useTeamBrandId,
  flattenTeams,
  isPrimaryAgent,
  onSelectRole
}: Props) {
  const classes = useStyles()

  const [searchCriteria, setSearchCriteria] = useState<string>('')

  const getRows = (
    teams: NormalizedBrand[],
    flattenTeams: boolean
  ): RowItem[] => {
    return teams.flatMap(team => {
      let data: RowItem[] = []

      if (!flattenTeams) {
        data = [
          {
            type: RowType.Header,
            name: team.name,
            subtitle: team.subtitle
          }
        ]
      }

      return [
        ...data,
        ...team.users.map(user => ({
          type: RowType.User,
          teamId: team.id,
          user
        }))
      ]
    })
  }

  return (
    <TeamAgents
      flattenTeams={flattenTeams}
      isPrimaryAgent={isPrimaryAgent}
      criteria={searchCriteria}
    >
      {({ teams, isLoading }) => {
        const rows = getRows(teams, flattenTeams)

        return isLoading ? (
          <CircularProgress disableShrink />
        ) : (
          <div>
            <Box className={classes.searchInputContainer}>
              <TextField
                fullWidth
                variant="outlined"
                onChange={e => setSearchCriteria(e.target.value)}
                placeholder="Search Agents"
                size="small"
              />
            </Box>

            {rows.length > 0 && (
              <Paper
                style={{
                  height:
                    rows.length < 5 ? `${rows.length * 60 + 16}px` : '250px'
                }}
              >
                <AutoSizer>
                  {({ width, height }) => (
                    <VirtualList
                      width={width}
                      height={height}
                      itemCount={rows.length}
                      itemData={
                        {
                          rows,
                          useTeamBrandId,
                          onSelectRole
                        } as React.ComponentProps<typeof Row>['data']
                      }
                      threshold={2}
                      itemSize={() => 60}
                      overscanCount={3}
                    >
                      {Row}
                    </VirtualList>
                  )}
                </AutoSizer>
              </Paper>
            )}
          </div>
        )
      }}
    </TeamAgents>
  )
}
