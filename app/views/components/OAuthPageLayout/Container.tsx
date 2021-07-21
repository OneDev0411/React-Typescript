import React, { ReactNode } from 'react'

import { Box, Theme } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'
import classnames from 'classnames'

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

export interface ContainerProps {
  children?: ReactNode
  className?: string
  classes?: ClassesProps<typeof styles>
}

export function Container(props: ContainerProps) {
  const classes = useStyles(props.classes)

  return (
    <Box className={classnames(classes.box, props.className)}>
      {props.children}
    </Box>
  )
}

export default Container
