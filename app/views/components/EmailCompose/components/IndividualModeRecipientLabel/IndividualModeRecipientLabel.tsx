import React from 'react'
import { Theme, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import IconLock from 'views/components/SvgIcons/Lock/IconLock'

const useStyles = makeStyles((theme: Theme) => ({
  lockIcon: {
    verticalAlign: 'text-bottom',
    margin: theme.spacing(0, 1)
  }
}))

export default function IndividualModeRecipientLabel() {
  const classes = useStyles()

  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      Recipients
      <Tooltip title="Emails will be sent individually">
        <IconLock className={classes.lockIcon} />
      </Tooltip>
    </span>
  )
}
