import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { Avatar } from '../../../../../../views/components/Avatar'

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
      color: theme.palette.navbar.contrastText
    },
    userDetails: {
      textAlign: 'left',
      marginLeft: theme.spacing(1),
      width: `calc(100% - ${theme.spacing(6)}px)`
    },
    arrowIcon: {
      color: theme.palette.navbar.contrastText,
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
  user: IUser
}

export default function ToggleButton(props: Props) {
  const { email, phone_number, display_name } = props.user
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
        <Avatar user={props.user} />
        <div className={classes.userDetails}>
          <Typography noWrap variant="body2">
            {display_name}
          </Typography>
          <Typography
            noWrap
            variant="caption"
            display="block"
            className={classes.userInfo}
          >
            {email || phone_number || ''}
          </Typography>
        </div>
      </Box>
    </DropdownToggleButton>
  )
}
