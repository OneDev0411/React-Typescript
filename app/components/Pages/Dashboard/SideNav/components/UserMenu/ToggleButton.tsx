import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { Avatar } from 'components/GeneralAvatar'

import { DropdownToggleButton } from '../../../../../../views/components/DropdownToggleButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownToggleButton: {
      maxWidth: '100%',
      margin: theme.spacing(0, 2),
      padding: theme.spacing(2, 0, 1.5),
      justifyContent: 'space-between',
      borderTop: `1px solid ${theme.palette.grey[800]}`
    },
    wrapper: {
      display: 'flex',
      width: `calc(100% - ${theme.spacing(3)}px)`,
      color: theme.palette.secondary.contrastText
    },
    userDetails: {
      textAlign: 'left',
      marginLeft: theme.spacing(1),
      width: `calc(100% - ${theme.spacing(6)}px)`
    },
    arrowIcon: {
      color: theme.palette.common.white,
      transform: 'rotateX(180deg)'
    },
    arrowIconRotated: {
      transform: 'rotateX(0)'
    },
    userInfo: {
      opacity: 0.7
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
        <Avatar alt={props.userName} url={props.userAvatar || ''} />
        <div className={classes.userDetails}>
          <Typography noWrap variant="body2">
            {props.userName}
          </Typography>
          <Typography
            noWrap
            variant="caption"
            display="block"
            className={classes.userInfo}
          >
            {props.userInfo}
          </Typography>
        </div>
      </Box>
    </DropdownToggleButton>
  )
}
