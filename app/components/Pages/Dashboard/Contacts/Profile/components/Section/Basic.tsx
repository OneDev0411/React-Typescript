import React, { ReactNode } from 'react'

import { Box, makeStyles, Theme, Typography } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      '&:first-child': {
        marginTop: theme.spacing(1)
      },

      marginBottom: (props: Props) => {
        if (props.title) {
          return theme.spacing(3)
        }

        return theme.spacing(1)
      }
    },
    title: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(0.2),
      fontSize: theme.typography.pxToRem(16),
      fontFamily: 'latoregular',
      fontWeight: 600
    },
    subtitle: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
      ...theme.typography.body3
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
        <Typography className={classes.title} variant="body2" gutterBottom>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography className={classes.subtitle}>{subtitle}</Typography>
      )}
      {children}
    </Box>
  )
}
