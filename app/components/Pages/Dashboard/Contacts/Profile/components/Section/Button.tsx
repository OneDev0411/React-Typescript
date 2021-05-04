import React, { MouseEvent } from 'react'
import { Box, Typography, makeStyles, Theme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.secondary.main,
      cursor: (props: Props) => {
        if (!props.onClick) {
          return 'initial'
        }

        return !props.disabled ? 'pointer' : 'not-allowed'
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
