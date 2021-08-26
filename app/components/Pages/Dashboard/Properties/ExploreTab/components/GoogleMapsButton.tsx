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
    borderRadius: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      '&:hover': {
        backgroundColor: '#000'
      }
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  label: {
    padding: '6px 15px',
    fontSize: 16,
    textTransform: 'capitalize',
    fontWeight: 'normal'
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
      style={{ top, left, right, bottom }}
      startIcon={startIcon}
      onClick={onClick}
      className={cn({ active })}
    >
      {children}
    </CustomizedGoogleMapsButton>
  )
}
