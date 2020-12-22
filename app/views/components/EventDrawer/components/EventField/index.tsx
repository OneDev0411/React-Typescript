import React, { ReactNode } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { SvgIcon, Props as SvgIconProps } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex'
    },
    icon: {
      width: theme.spacing(3)
    },
    field: {
      flexGrow: 1,
      paddingLeft: theme.spacing(1)
    }
  })
)

interface Props {
  name: string
  children: ReactNode
  iconProps: SvgIconProps
}

export const EventField = ({ children, iconProps }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.icon}>
        <SvgIcon {...iconProps} />
      </div>
      <div className={classes.field}>{children}</div>
    </div>
  )
}
