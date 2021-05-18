import { ReactNode } from 'react'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.primary.main }
  }),
  { name: 'ShowingGreenLabel' }
)

interface ShowingGreenLabelProps {
  children: ReactNode
}

function ShowingGreenLabel({ children }: ShowingGreenLabelProps) {
  const classes = useStyles()

  return <span className={classes.root}>{children}</span>
}

export default ShowingGreenLabel
