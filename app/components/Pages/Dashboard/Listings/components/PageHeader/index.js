import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import GlobalPageLayout from 'components/GlobalPageLayout'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.up('md')]: {
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
      <GlobalPageLayout.Header title={title} isHiddenOnMobile={false}>
        <Typography variant="h6" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </GlobalPageLayout.Header>
    </Box>
  )
}
