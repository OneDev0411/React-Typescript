import React, { ReactNode } from 'react'

import { Box, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginBottom: (props: Props) => {
        if (props.title) {
          return theme.spacing(6)
        }

        return theme.spacing(1)
      }
    },
    title: {
      display: 'inline-block',
      paddingLeft: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
      marginTop: (props: Props) => (props.marginTop ? theme.spacing(1) : '0px'),
      color: theme.palette.text.primary,
      ...theme.typography.body1
    }
  }),
  { name: 'ContactProfileBasicSection' }
)

interface Props {
  title?: string
  children?: ReactNode
  marginTop?: boolean
}

export const BasicSection = ({ title, children, marginTop }: Props) => {
  const classes = useStyles({ title, children, marginTop })

  return (
    <Box className={classes.container}>
      {title && <span className={classes.title}>{title}</span>}
      {children}
    </Box>
  )
}
