import { ReactNode } from 'react'

import { DialogContent, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { paddingTop: theme.spacing(3) }
  }),
  { name: 'ConfirmationDialogBody' }
)

interface ConfirmationDialogBodyProps {
  children: ReactNode
  wrapInDialogContent?: boolean
}

function ConfirmationDialogBody({
  children,
  wrapInDialogContent = true
}: ConfirmationDialogBodyProps) {
  const classes = useStyles()

  return wrapInDialogContent ? (
    <DialogContent className={classes.root}>
      <Typography variant="body2" component="div">
        {children}
      </Typography>
    </DialogContent>
  ) : (
    <>{children}</>
  )
}

export default ConfirmationDialogBody
