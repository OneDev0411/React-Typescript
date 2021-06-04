import { useState } from 'react'
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  makeStyles
} from '@material-ui/core'

import TreeView from 'components/TreeView'

import { useBrandTree } from './use-brand-tree'

const useStyles = makeStyles(
  () => ({
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
}

export default function TeamTreeView({ onSelectTeam }: Props) {
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
          </Grid>
        )
      }}
    />
  )
}
