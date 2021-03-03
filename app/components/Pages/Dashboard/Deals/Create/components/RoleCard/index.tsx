import React, { useState } from 'react'

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

import type { IDealFormRole } from '../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      width: '100%',
      marginBottom: theme.spacing(1)
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
  role: IDealFormRole | IDealRole
  readonly?: boolean
  onClickEdit?: () => void
  onClickRemove?: (() => void) | (() => Promise<void>)
}

export function RoleCard({
  role,
  readonly = false,
  onClickEdit = () => {},
  onClickRemove = () => {}
}: Props) {
  const classes = useStyles()
  const [isRemoving, setIsRemoving] = useState(false)

  const address =
    typeof role.current_address === 'string'
      ? role.current_address
      : role.current_address?.full

  const handleRemove = async () => {
    setIsRemoving(true)
    await onClickRemove()
    setIsRemoving(false)
  }

  if (isRemoving) {
    return null
  }

  return (
    <Box display="flex" alignItems="flex-start" className={classes.root}>
      <Box flex={2} className={classes.avatarContainer}>
        <Avatar alt={getLegalFullName(role)} />
      </Box>
      <Box flex={6}>
        <Typography variant="body2">{getLegalFullName(role)}</Typography>

        <Typography variant="body2" className={classes.detail}>
          {role.role}
        </Typography>

        {role.current_address && (
          <Box my={1}>
            <Typography variant="caption">{address}</Typography>
          </Box>
        )}
      </Box>

      <Box display="flex" flex={2}>
        {!readonly && (
          <>
            <Box pl={2}>
              <IconButton size="medium" onClick={onClickEdit}>
                <SvgIcon
                  path={mdiAccountEditOutline}
                  size={muiIconSizes.medium}
                />
              </IconButton>
            </Box>

            <Box>
              <IconButton size="medium" onClick={handleRemove}>
                <SvgIcon path={mdiDeleteOutline} size={muiIconSizes.medium} />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
