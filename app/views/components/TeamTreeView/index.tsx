import { useState } from 'react'
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  makeStyles
} from '@material-ui/core'
import pluralize from 'pluralize'

import TreeView from 'components/TreeView'

import { useBrandTree } from './use-brand-tree'

const useStyles = makeStyles(
  theme => ({
    nodeContainer: {
      cursor: 'pointer'
    }
  }),
  {
    name: 'TeamTreeView'
  }
)

export interface Props {
  onSelectTeam: (team: IBrand) => void
  hideMembersCount?: boolean
}

export default function TeamTreeView({
  onSelectTeam,
  hideMembersCount = false
}: Props) {
  const classes = useStyles()
  const [selectedTeam, setSelectedTeam] = useState<Nullable<IBrand>>(null)
  const { isLoading, getChildNodes, initialExpandedNodes } = useBrandTree()

  const handleSelectTeam = (team: IBrand) => {
    setSelectedTeam(team)
    onSelectTeam(team)
  }

  if (isLoading) {
    return (
      <Grid container alignItems="center" justify="center">
        <Box py={3}>
          <CircularProgress />
        </Box>
      </Grid>
    )
  }

  return (
    <TreeView
      selectable
      getChildNodes={getChildNodes}
      getNodeId={(team: IBrand) => team.id}
      initialExpandedNodes={initialExpandedNodes}
      renderNode={(team: IBrand) => {
        const isSelected = selectedTeam?.id === team.id

        return (
          <Grid
            container
            spacing={2}
            alignItems="center"
            className={classes.nodeContainer}
            onClick={() => handleSelectTeam(team)}
          >
            <Grid item>
              <Typography
                variant="body1"
                color={isSelected ? 'primary' : 'textPrimary'}
              >
                {team.name}
              </Typography>
            </Grid>
            {!hideMembersCount && (
              <Grid item>
                <Typography variant="caption" color="textSecondary">
                  {pluralize('member', team.member_count, true)}
                </Typography>
              </Grid>
            )}
          </Grid>
        )
      }}
    />
  )
}
