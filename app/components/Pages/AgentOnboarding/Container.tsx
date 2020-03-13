import React, { ReactNode } from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    box: {
      maxWidth: '33rem',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      margin: '15vh auto 0'
    }
  })
)

interface Props {
  children: ReactNode
}

export default function Container({ children, ...props }: Props) {
  const classes = useStyles(props)

  return <Box className={classes.box}>{children}</Box>
}
