import { Box, Typography, makeStyles } from '@material-ui/core'
import { ReactNode } from 'react'

const useStyles = makeStyles(
  {
    root: {
      cursor: 'pointer'
    }
  },
  { name: 'ShowingDetailTabVisitorsIconLabel' }
)

interface ShowingDetailTabVisitorsIconLabelProps {
  icon: ReactNode
  label: string
  marginRight?: number
  onClick?: () => void
}

function ShowingDetailTabVisitorsIconLabel({
  icon,
  label,
  marginRight,
  onClick
}: ShowingDetailTabVisitorsIconLabelProps) {
  const classes = useStyles()

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

export default ShowingDetailTabVisitorsIconLabel
