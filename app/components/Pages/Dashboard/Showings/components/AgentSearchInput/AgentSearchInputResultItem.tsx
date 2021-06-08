import React from 'react'

import cn from 'classnames'
import { Box, Avatar, Typography, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(1),
      border: '1px solid transparent',
      transition: theme.transitions.create('background-color')
    },
    hoverable: {
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover
      }
    },
    avatarContainer: {
      paddingRight: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey['500']
    },
    selected: {
      borderColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'AgentSearchInputResultItem'
  }
)

interface AgentSearchInputResultItemProps {
  name: string
  email: string
  avatarUrl?: string
  selected: boolean
  onClick?: () => void
}

function AgentSearchInputResultItem({
  name,
  email,
  avatarUrl,
  onClick,
  selected
}: AgentSearchInputResultItemProps) {
  const classes = useStyles()

  return (
    <Box
      display="flex"
      className={cn(classes.root, {
        [classes.hoverable]: !!onClick,
        [classes.selected]: selected
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

export default AgentSearchInputResultItem
