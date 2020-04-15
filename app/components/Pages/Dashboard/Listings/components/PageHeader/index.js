import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import GlobalPageLayout from 'components/GlobalPageLayout'

const useStyles = makeStyles(theme =>
  createStyles({
    subtitle: {
      color: theme.palette.grey['400']
    }
  })
)

export function Header(props) {
  const classes = useStyles(props)
  const { subtitle, title } = props

  return (
    <Box py={5}>
      <GlobalPageLayout.Header>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h6" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </GlobalPageLayout.Header>
    </Box>
  )
}
