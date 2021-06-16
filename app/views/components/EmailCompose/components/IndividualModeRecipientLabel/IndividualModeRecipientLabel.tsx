import React from 'react'
import { Theme, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { mdiLockOutline } from '@mdi/js'

import { SvgIcon } from 'views/components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
      Bcc
      <Tooltip title="Emails will be sent individually">
        <SvgIcon
          path={mdiLockOutline}
          className={classes.lockIcon}
          size={muiIconSizes.small}
        />
      </Tooltip>
    </span>
  )
}
