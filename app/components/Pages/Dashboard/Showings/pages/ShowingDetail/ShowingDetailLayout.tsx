import { ReactNode } from 'react'

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      margin: theme.spacing(3, 4, 4)
    }
  }),
  { name: 'ShowingDetailLayout' }
)

interface ShowingDetailLayoutProps {
  children: ReactNode
}

function ShowingDetailLayout({ children }: ShowingDetailLayoutProps) {
  const classes = useStyles()

  return <div className={classes.root}>{children}</div>
}

export default ShowingDetailLayout
