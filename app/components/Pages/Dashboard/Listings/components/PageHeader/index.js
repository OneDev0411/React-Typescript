import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import GlobalPageLayout from 'components/GlobalPageLayout'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      [theme.breakpoints.up('md')]: {
        height: theme.spacing(15),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }
    },
    subtitle: {
      color: theme.palette.grey['400'],
      [theme.breakpoints.up('md')]: {
        marginLeft: theme.spacing(2)
      }
    }
  })
)

export function Header(props) {
  const classes = useStyles(props)
  const { subtitle, title } = props

  return (
    <Box className={classes.container}>
      <GlobalPageLayout.Header classes={{ content: classes.container }}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </GlobalPageLayout.Header>
    </Box>
  )
}
