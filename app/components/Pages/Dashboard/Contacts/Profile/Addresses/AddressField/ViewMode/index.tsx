import React from 'react'
import classNames from 'classnames'
import { Box, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import StarIcon from 'components/SvgIcons/Star/StarIcon'

import { useIconStyles } from '../../../../../../../../styles/use-icon-styles'

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
      fill: theme.palette.text.primary
    },
    value: ({ address }: Props) => ({
      textAlign: address.id ? 'left' : 'right',
      color: address.id ? theme.palette.text.primary : theme.palette.text.hint
    })
  })
)

export function ViewMode(props: Props) {
  const classes = useStyles(props)
  const iconClasses = useIconStyles()
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
            <StarIcon
              className={classNames(
                classes.starIcon,
                iconClasses.small,
                iconClasses.leftMargin
              )}
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
