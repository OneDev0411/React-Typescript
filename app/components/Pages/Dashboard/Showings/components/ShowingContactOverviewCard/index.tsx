import React, { ReactNode } from 'react'
import {
  Avatar,
  AvatarProps,
  Box,
  makeStyles,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(1, 1.5, 1, 3),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      width: '100%',
      minHeight: theme.spacing(11)
    },
    detail: {
      color: theme.palette.grey['500']
    }
  }),
  { name: 'ShowingContactOverviewCard' }
)

interface ShowingContactOverviewCardProps {
  avatarUrl?: AvatarProps['src']
  fullName: string
  subtitle?: string
  actions?: ReactNode
}

function ShowingContactOverviewCard({
  avatarUrl,
  fullName,
  subtitle,
  actions
}: ShowingContactOverviewCardProps) {
  const classes = useStyles()

  return (
    <Box display="flex" alignItems="center" className={classes.root}>
      <Box flex={0} pr={2}>
        <Avatar alt={fullName} src={avatarUrl} />
      </Box>
      <Box flex={6} alignItems="center">
        <Typography variant="body1">{fullName}</Typography>
        {subtitle && (
          <Typography variant="body2" className={classes.detail}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box display="flex" flex="0 0">
          {actions}
        </Box>
      )}
    </Box>
  )
}

export default ShowingContactOverviewCard
