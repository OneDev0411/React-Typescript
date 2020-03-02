import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import PageLayout from 'components/GlobalPageLayout'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      height: '6em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: theme.spacing(0, 1.5),
      paddingTop: theme.spacing(7)
    },
    subtitle: {
      color: theme.palette.grey['400']
    }
  })
)

export function Header(props) {
  const classes = useStyles(props)
  const { subtitle, title } = props

  return (
    <Box className={classes.container}>
      <PageLayout.Header>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </PageLayout.Header>
    </Box>
  )
}
