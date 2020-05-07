import React, { ReactNode } from 'react'
import { Box, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

import { ClassesProps } from 'utils/ts-utils'

const styles = (theme: Theme) =>
  createStyles({
    box: {
      width: '100%',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
      margin: '0 auto',
      padding: '3rem 1rem 0',
      [theme.breakpoints.up('sm')]: {
        paddingTop: '13vh',
        maxWidth: '33rem'
      }
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
