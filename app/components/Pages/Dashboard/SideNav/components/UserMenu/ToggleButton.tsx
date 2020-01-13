import React from 'react'
import { Avatar, Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { DropdownToggleButton } from '../../../../../../views/components/DropdownToggleButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownToggleButton: {
      maxWidth: '100%',
      margin: '0 1rem',
      padding: '1rem 0 0.75rem',
      justifyContent: 'space-between',
      borderTop: `1px solid ${theme.palette.grey[800]}`
    },
    wrapper: {
      display: 'flex',
      width: 'calc(100% - 1.5rem)',
      color: theme.palette.secondary.contrastText
    },
    userDetails: {
      textAlign: 'left',
      marginLeft: '0.5rem',
      width: 'calc(100% - 3rem)'
    },
    arrowIcon: {
      fill: '#fff',
      transform: 'rotateX(180deg)'
    },
    arrowIconRotated: {
      transform: 'rotateX(0)'
    }
  })
)

interface Props {
  onClick: (e) => void
  id: string
  isOpen: boolean
  userAvatar: string
  userInfo: string
  userName: string
}

export default function ToggleButton(props: Props) {
  const classes = useStyles()

  return (
    <DropdownToggleButton
      id={props.id}
      onClick={props.onClick}
      isActive={props.isOpen}
      classes={{
        arrowIcon: classes.arrowIcon,
        root: classes.dropdownToggleButton,
        rotated: classes.arrowIconRotated
      }}
    >
      <Box className={classes.wrapper}>
        <Avatar alt={props.userName} src={props.userAvatar || ''} />
        <div className={classes.userDetails}>
          <Typography noWrap variant="body2">
            {props.userName}
          </Typography>
          <Typography noWrap variant="caption" display="block">
            {props.userInfo}
          </Typography>
        </div>
      </Box>
    </DropdownToggleButton>
  )
}
