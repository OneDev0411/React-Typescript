import React, { MouseEvent } from 'react'
import { Box, Typography, makeStyles, Theme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '100%',
      padding: theme.spacing(0.5),
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700],
      borderRadius: theme.shape.borderRadius,
      cursor: (props: Props) => {
        if (!props.onClick) {
          return 'initial'
        }

        return !props.disabled ? 'pointer' : 'not-allowed'
      },
      '&:hover': {
        color: theme.palette.secondary.main,
        background: theme.palette.action.hover
      }
    },
    label: {
      marginLeft: theme.spacing(0.5)
    }
  }),
  { name: 'ContactProfileSectionButton' }
)

interface Props {
  icon: string
  label: string
  disabled?: boolean
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

export const SectionButton = ({ label, icon, disabled, onClick }: Props) => {
  const classes = useStyles({ label, icon, disabled, onClick })

  return (
    <Box className={classes.container} onClick={onClick}>
      <SvgIcon path={icon} size={muiIconSizes.small} />
      <Typography variant="body2" className={classes.label}>
        {label}
      </Typography>
    </Box>
  )
}
