import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'

import PageLayout from 'components/GlobalPageLayout'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      height: '6em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: theme.spacing(0, 1.5)
    }
  })
)

export function Header(props) {
  const classes = useStyles(props)
  const { subtitle, title } = props

  // {props.title}
  // {subtitle}
  // {props.activeView}
  // {props.onChangeView}
  return (
    <Box className={classes.container}>
      <PageLayout.Header title={title} />
    </Box>
  )
}
