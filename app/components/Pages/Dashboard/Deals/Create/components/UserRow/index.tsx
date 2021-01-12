import React from 'react'

import cn from 'classnames'
import { Box, Avatar, Typography, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(1)
    },
    hoverable: {
      '&:hover': {
        cursor: 'pointer',
        background: theme.palette.action.hover
      }
    },
    avatarContainer: {
      paddingRight: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey['500']
    }
  }),
  {
    name: 'CreateDeal-RoleRow'
  }
)

interface Props {
  name: string
  email: string
  avatarUrl?: string
  onClick?: () => void
}

export function UserRow({ name, email, avatarUrl, onClick }: Props) {
  const classes = useStyles()

  return (
    <Box
      display="flex"
      className={cn(classes.root, {
        [classes.hoverable]: !!onClick
      })}
      onClick={onClick}
    >
      <div className={classes.avatarContainer}>
        <Avatar src={avatarUrl} alt={name} />
      </div>
      <div>
        <Typography variant="body2">{name}</Typography>
        <Typography variant="body2" className={classes.email}>
          {email}
        </Typography>
      </div>
    </Box>
  )
}
