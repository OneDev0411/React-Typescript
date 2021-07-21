import { ReactNode } from 'react'

import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { color: theme.palette.grey[500] }
  }),
  { name: 'ListingsListColumnText' }
)

interface ListingsListColumnTextProps {
  children: ReactNode
}

function ListingsListColumnText({ children }: ListingsListColumnTextProps) {
  const classes = useStyles()

  return (
    <Typography className={classes.root} variant="body2" component="span">
      {children}
    </Typography>
  )
}

export default ListingsListColumnText
