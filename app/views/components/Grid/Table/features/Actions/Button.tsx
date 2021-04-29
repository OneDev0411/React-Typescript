import React, { ReactNode } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

// import { fade } from '@material-ui/core/styles'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  icon?: string
  textIcon?: ReactNode
  label: ReactNode
  onClick?: () => void
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        flexGrow: 1,
        '&:not(:last-child)': {
          borderRight: `1px solid ${theme.palette.grey[700]}`
        }
      },
      button: {
        textAlign: 'center'
      },
      icon: {
        margin: 'auto',
        display: 'block',
        color: theme.palette.background.paper
      },
      label: {
        marginTop: theme.spacing(0.5),
        color: theme.palette.grey[300],
        ...theme.typography.body2
      }
    }),
  {
    name: 'GridActionButton'
  }
)

export const GridActionButton = ({ label, icon }: Props) => {
  const classes = useStyles()
  // const [state, dispatch] = useGridContext()

  return (
    <div className={classes.container}>
      <div className={classes.button}>
        {icon && <SvgIcon path={icon} className={classes.icon} />}
        <div className={classes.label}>{label}</div>
      </div>
    </div>
  )
}
