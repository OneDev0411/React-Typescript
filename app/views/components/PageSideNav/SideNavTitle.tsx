import React from 'react'
import { Typography } from '@material-ui/core'

function SideNavTitle(props) {
  return (
    <Typography variant="subtitle1" component="h6">
      {props.children}
    </Typography>
  )
}

export default SideNavTitle
