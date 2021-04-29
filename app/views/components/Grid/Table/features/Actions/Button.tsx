import React, { ReactNode, MouseEvent, RefObject } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

// import { fade } from '@material-ui/core/styles'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { noop } from 'utils/helpers'

interface Props {
  icon?: string
  textIcon?: ReactNode
  label: ReactNode
  disabled?: boolean
  ref?: RefObject<any>
  onClick?: (e: MouseEvent<HTMLElement>) => void
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
        textAlign: 'center',
        cursor: 'pointer'
      },
      icon: {
        margin: 'auto',
        display: 'block',
        color: theme.palette.background.paper
      },
      textIcon: {},
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

export const GridActionButton = ({
  label,
  icon,
  ref,
  textIcon,
  onClick = noop
}: Props) => {
  const classes = useStyles()
  // const [state, dispatch] = useGridContext()

  return (
    <div className={classes.container}>
      <div className={classes.button} onClick={onClick} ref={ref}>
        {icon && <SvgIcon path={icon} className={classes.icon} />}
        {textIcon && <div className={classes.textIcon}>{textIcon}</div>}
        <div className={classes.label}>{label}</div>
      </div>
    </div>
  )
}
