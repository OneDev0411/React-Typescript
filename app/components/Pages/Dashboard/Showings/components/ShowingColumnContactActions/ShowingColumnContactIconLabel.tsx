import { ReactNode } from 'react'

import { Box, Typography, Tooltip, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  {
    root: {
      cursor: 'pointer'
    }
  },
  { name: 'ShowingColumnContactIconLabel' }
)

interface ShowingColumnContactIconLabelProps {
  icon: ReactNode
  label: string
  marginRight?: number
  onClick?: () => void
  compact: boolean
}

function ShowingColumnContactIconLabel({
  icon,
  label,
  marginRight,
  onClick,
  compact
}: ShowingColumnContactIconLabelProps) {
  const classes = useStyles()

  if (compact) {
    return (
      <Tooltip title={label}>
        <Box
          display="inline-block"
          marginRight={marginRight}
          onClick={onClick}
          className={onClick ? classes.root : undefined}
        >
          {icon}
        </Box>
      </Tooltip>
    )
  }

  return (
    <Box
      display="inline-flex"
      flexDirection="column"
      alignItems="center"
      color="grey.600"
      marginRight={marginRight}
      onClick={onClick}
      className={onClick ? classes.root : undefined}
    >
      <Box color="common.black">{icon}</Box>
      <Typography variant="body2" component="div">
        {label}
      </Typography>
    </Box>
  )
}

export default ShowingColumnContactIconLabel
