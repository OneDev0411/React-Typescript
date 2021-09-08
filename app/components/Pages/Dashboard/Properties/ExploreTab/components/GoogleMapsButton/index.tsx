import React from 'react'

import { Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'

const CustomizedGoogleMapsButton = withStyles(theme => ({
  root: {
    position: 'absolute',
    zIndex: 1,
    padding: 0,
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 2,
    boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px',
    '&.active': {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[900]
    },
    '&:hover': {
      color: theme.palette.grey[900],
      backgroundColor: theme.palette.grey[300]
    }
  },
  label: {
    padding: '6px 15px',
    fontSize: theme.typography.button.fontSize,
    textTransform: 'capitalize',
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular
  }
}))(Button)

interface Props {
  children: React.ReactNode
  top?: React.CSSProperties['top']
  left?: React.CSSProperties['left']
  bottom?: React.CSSProperties['bottom']
  right?: React.CSSProperties['right']
  startIcon?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  active?: boolean
}

export const GoogleMapsButton = ({
  children,
  top = 'unset',
  left = 'unset',
  bottom = 'unset',
  right = 'unset',
  startIcon,
  onClick,
  active = false
}: Props) => {
  return (
    <CustomizedGoogleMapsButton
      size="small"
      style={{ top, left, right, bottom }}
      startIcon={startIcon}
      onClick={onClick}
      className={cn({ active })}
    >
      {children}
    </CustomizedGoogleMapsButton>
  )
}
