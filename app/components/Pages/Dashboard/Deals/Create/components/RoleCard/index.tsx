import React from 'react'

import {
  Box,
  Avatar,
  Typography,
  makeStyles,
  Theme,
  IconButton
} from '@material-ui/core'

import { mdiAccountEditOutline, mdiDeleteOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { getLegalFullName } from '../../../utils/roles'

import type { IDealFormPrimaryAgent } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 1, 1, 0)
    },
    avatarContainer: {
      paddingRight: theme.spacing(2)
    },
    detail: {
      color: theme.palette.grey['500']
    }
  }),
  {
    name: 'CreateDeal-RoleCard'
  }
)

interface Props {
  agent: IDealFormPrimaryAgent
  onClickEdit: () => void
  onClickRemove: () => void
}

export function RoleCard({ agent, onClickEdit, onClickRemove }: Props) {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="flex-start" className={classes.root}>
      <Box flex={2} className={classes.avatarContainer}>
        <Avatar alt={getLegalFullName(agent)} />
      </Box>
      <Box flex={6}>
        <Typography variant="body2">{getLegalFullName(agent)}</Typography>
        {agent.email && (
          <Typography variant="body2" className={classes.detail}>
            {agent.email}
          </Typography>
        )}

        {agent.current_address && (
          <Box my={1}>
            <Typography variant="caption">
              {agent.current_address.full}
            </Typography>
          </Box>
        )}
      </Box>

      <Box display="flex" flex={2}>
        <Box pl={2}>
          <IconButton size="medium" onClick={onClickEdit}>
            <SvgIcon path={mdiAccountEditOutline} size={muiIconSizes.medium} />
          </IconButton>
        </Box>

        <Box>
          <IconButton size="medium" onClick={onClickRemove}>
            <SvgIcon path={mdiDeleteOutline} size={muiIconSizes.medium} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
