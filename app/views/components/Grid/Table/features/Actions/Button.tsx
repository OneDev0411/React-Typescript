import React, { ReactNode, MouseEvent, RefObject } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  icon?: string
  textIcon?: ReactNode
  label: ReactNode
  disabled?: boolean
  attachedElementRef?: RefObject<any>
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        '&:not(:last-child)': {
          borderRight: `1px solid ${theme.palette.grey[700]}`
        }
      },
      button: {
        textAlign: 'center',
        cursor: (props: Props) => {
          if (!props.onClick) {
            return 'initial'
          }

          return !props.disabled ? 'pointer' : 'not-allowed'
        }
      },
      icon: {
        margin: 'auto',
        display: 'block',
        color: theme.palette.background.paper,
        opacity: (props: Props) => (!props.disabled ? 1 : 0.6)
      },
      textIcon: {},
      label: {
        marginTop: theme.spacing(0.5),
        color: theme.palette.grey[300],
        opacity: (props: Props) => (!props.disabled ? 1 : 0.6),
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
  attachedElementRef,
  textIcon,
  onClick
}: Props) => {
  const classes = useStyles({
    label,
    icon,
    attachedElementRef,
    textIcon,
    onClick
  })

  const handleOnClick = (e: MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <div className={classes.container}>
      <div
        className={classes.button}
        onClick={handleOnClick}
        ref={attachedElementRef}
      >
        {icon && <SvgIcon path={icon} className={classes.icon} />}
        {textIcon && <div className={classes.textIcon}>{textIcon}</div>}
        <div className={classes.label}>{label}</div>
      </div>
    </div>
  )
}
