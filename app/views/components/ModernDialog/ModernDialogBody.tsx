import { ReactNode } from 'react'

import { DialogContent, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { paddingTop: theme.spacing(3) }
  }),
  { name: 'ModernDialogBody' }
)

interface ModernDialogBodyProps {
  children: ReactNode
  wrapInDialogContent?: boolean
}

function ModernDialogBody({
  children,
  wrapInDialogContent = true
}: ModernDialogBodyProps) {
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

export default ModernDialogBody
