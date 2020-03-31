import React, { ReactNode } from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

import { ClassesProps } from 'utils/ts-utils'

const styles = () =>
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

const useStyles = makeStyles(styles)

interface Props {
  children: ReactNode
}

export default function Container({
  children,
  ...props
}: Props & ClassesProps<typeof styles>) {
  const classes = useStyles(props)

  return <Box className={classes.box}>{children}</Box>
}
