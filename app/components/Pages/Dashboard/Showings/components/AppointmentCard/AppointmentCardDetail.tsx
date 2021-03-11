import React, { ReactElement } from 'react'
import { Box, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    title: { marginLeft: theme.spacing(1) },
    subtitle: { color: theme.palette.grey[500] }
  }),
  { name: 'AppointmentCardDetail' }
)

interface AppointmentCardDetailProps {
  className?: string
  icon: ReactElement<unknown>
  title: string
  subtitle?: string
}

function AppointmentCardDetail({
  className,
  icon,
  title,
  subtitle
}: AppointmentCardDetailProps) {
  const classes = useStyles()

  return (
    <Box className={className} display="flex" alignItems="center">
      {icon}
      <Typography className={classes.title} variant="body2" noWrap>
        {title}{' '}
        {subtitle && <span className={classes.subtitle}>({subtitle})</span>}
      </Typography>
    </Box>
  )
}

export default AppointmentCardDetail
