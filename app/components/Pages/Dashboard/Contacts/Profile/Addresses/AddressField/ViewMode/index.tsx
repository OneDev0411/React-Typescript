import React from 'react'
import { Box, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { mdiStarOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

interface Props {
  address: any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: ({ address }: Props) => ({
      display: 'flex',
      flexDirection: address.id ? 'column' : 'row',
      alignItems: address.id ? 'initial' : 'center',
      justifyContent: 'space-between',

      '&:hover $label': {
        color: theme.palette.text.primary
      }
    }),
    leftSide: {
      display: 'flex',
      alignItems: 'center'
    },
    label: ({ address }: Props) => ({
      color: address.id ? theme.palette.text.primary : theme.palette.text.hint
    }),
    starIcon: {
      color: theme.palette.text.primary
    },
    value: ({ address }: Props) => ({
      textAlign: address.id ? 'left' : 'right',
      color: address.id ? theme.palette.text.primary : theme.palette.text.hint
    })
  })
)

export function ViewMode(props: Props) {
  const classes = useStyles(props)
  const { address } = props

  let label = address.label

  if (!address.label) {
    label = address.id ? '' : 'Home'
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.leftSide}>
        <Typography variant="body2" className={classes.label}>
          {label}
        </Typography>
        {address.is_primary && address.id && (
          <Tooltip title="Primary Address">
            <SvgIcon
              path={mdiStarOutline}
              leftMargined
              size={muiIconSizes.small}
              className={classes.starIcon}
            />
          </Tooltip>
        )}
      </Box>
      <Typography variant="body2" className={classes.value}>
        {address.full_address || '-'}
      </Typography>
    </Box>
  )
}
