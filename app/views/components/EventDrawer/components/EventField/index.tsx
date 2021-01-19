import React, { ReactNode } from 'react'
import { makeStyles, Theme } from '@material-ui/core'

import { SvgIcon, Props as SvgIconProps } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      '&:not(:last-child)': {
        marginBottom: theme.spacing(2)
      }
    },
    icon: {
      marginTop: theme.spacing(1),
      width: theme.spacing(3)
    },
    field: {
      flexGrow: 1,
      paddingLeft: theme.spacing(1)
    }
  }),
  { name: 'EventField' }
)

interface Props {
  title: string
  children: ReactNode
  iconProps?: SvgIconProps
}

export const EventField = ({ title, children, iconProps }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {iconProps && (
        <div className={classes.icon}>
          <SvgIcon {...iconProps} />
        </div>
      )}
      <div className={classes.field}>{children}</div>
    </div>
  )
}
