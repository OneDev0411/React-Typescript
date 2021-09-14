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
    boxShadow: 'rgb(0 0 0 / 30%) 0px 1px 4px -1px !important',
    '&.active': {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[900]
    },
    '&:hover': {
      color: theme.palette.grey[900],
      backgroundColor: theme.palette.grey[300]
    },
    '&.iconButton': {
      minWidth: 'unset',
      padding: '6px 0',
      '& .MuiButton-startIcon': {
        margin: 0
      }
    }
  },
  label: {
    padding: '6px 12px',
    fontSize: theme.typography.button.fontSize,
    textTransform: 'capitalize',
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular
  }
}))(Button)

interface Props {
  children?: React.ReactNode
  top?: React.CSSProperties['top']
  left?: React.CSSProperties['left']
  bottom?: React.CSSProperties['bottom']
  right?: React.CSSProperties['right']
  startIcon?: React.ReactNode
  iconButton?: boolean
  size?: 'small' | 'medium' | 'large'
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
  size = 'small',
  active = false,
  iconButton = false
}: Props) => {
  return (
    <CustomizedGoogleMapsButton
      title="Get your exact location on the map"
      size={size}
      style={{ top, left, right, bottom }}
      startIcon={startIcon}
      onClick={onClick}
      className={cn({ active, iconButton })}
    >
      {children}
    </CustomizedGoogleMapsButton>
  )
}
