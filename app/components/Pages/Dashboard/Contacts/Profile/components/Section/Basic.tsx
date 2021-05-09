import React, { ReactNode } from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      paddingBottom: theme.spacing(0.5)
    },
    title: {
      display: 'inline-block',
      marginBottom: theme.spacing(1.5),
      color: theme.palette.grey[700],
      ...theme.typography.body1
    }
  }),
  { name: 'ContactProfileBasicSection' }
)

interface Props {
  title?: string
  children?: ReactNode
}

export const BasicSection = ({ title, children }: Props) => {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      {title && <span className={classes.title}>{title}</span>}
      {children}
    </Box>
  )
}
