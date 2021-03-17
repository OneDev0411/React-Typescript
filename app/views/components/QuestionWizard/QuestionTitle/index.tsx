import { Typography, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

interface Props {
  children: React.ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      background: theme.palette.grey[100],
      borderRadius: theme.spacing(2, 2, 2, 0),
      display: 'inline-block',
      padding: theme.spacing(2, 4),
      maxWidth: '65%'
    }
  }),
  {
    name: 'QuestionWizard-Title'
  }
)

export function QuestionTitle({ children }: Props) {
  const classes = useStyles()

  return (
    <Typography variant="h6" className={classes.root}>
      {children}
    </Typography>
  )
}
