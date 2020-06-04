import React, { ReactNode } from 'react'
import { Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      margin: 'auto',
      marginTop: theme.spacing(9.5),
      width: '100%',
      textAlign: 'center',
      userSelect: 'none'
    }
  }),
  { name: 'NoContentMessage' }
)

interface Props {
  children: ReactNode
  error?: boolean
}

export default function NoContentMessage({ children, error }: Props) {
  const classes = useStyles()

  return (
    <Typography
      variant="body1"
      color={error ? 'error' : 'inherit'}
      className={classes.root}
    >
      {children}
    </Typography>
  )
}
