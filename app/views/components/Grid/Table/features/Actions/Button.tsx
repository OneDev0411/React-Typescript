import React, { ReactNode, MouseEvent, RefObject } from 'react'

import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  icon?: string
  tooltip?: string
  textIcon?: ReactNode
  label: ReactNode
  disabled?: boolean
  attachedElementRef?: RefObject<any>
  tourId?: string
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
        cursor: (props: Props) => {
          if (!props.onClick) {
            return 'initial'
          }

          return !props.disabled ? 'pointer' : 'not-allowed'
        },
        '&:hover': {
          '& $icon, & $label': {
            color: (props: Props) =>
              !props.onClick ? '' : theme.palette.primary.main
          }
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
        display: 'inline-block',
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
  disabled,
  icon,
  attachedElementRef,
  textIcon,
  tooltip = '',
  onClick,
  tourId
}: Props) => {
  const classes = useStyles({
    label,
    disabled,
    icon,
    attachedElementRef,
    textIcon,
    onClick
  })

  const handleOnClick = (e: MouseEvent<HTMLElement>) => {
    if (disabled) {
      return
    }

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <div className={classes.container}>
      <Tooltip title={tooltip} placement="top">
        <div
          className={classes.button}
          onClick={handleOnClick}
          ref={attachedElementRef}
        >
          {icon && <SvgIcon path={icon} className={classes.icon} />}
          {textIcon && <div className={classes.textIcon}>{textIcon}</div>}
          <div className={classes.label} data-tour-id={tourId || ''}>
            {label}
          </div>
        </div>
      </Tooltip>
    </div>
  )
}
