import React, { ReactNode } from 'react'

import { Box, makeStyles, Theme, Typography } from '@material-ui/core'

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
      paddingLeft: theme.spacing(1),
      marginBottom: theme.spacing(0.2),
      fontSize: theme.typography.body2.fontSize
    },
    subtitle: {
      paddingLeft: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
      color: theme.palette.text.secondary,
      fontSize: theme.typography.body3.fontSize
    }
  }),
  { name: 'ContactProfileBasicSection' }
)

interface Props {
  title?: string
  subtitle?: string
  children?: ReactNode
}

export const BasicSection = ({ title, subtitle, children }: Props) => {
  const classes = useStyles({ title, children })

  return (
    <Box className={classes.container}>
      {title && (
        <Typography className={classes.title} variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography className={classes.subtitle} variant="body2">
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  )
}
