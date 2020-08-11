import React from 'react'
import { Tooltip } from '@material-ui/core'

import { mdiAlertOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

export default ({ message }) => (
  <Tooltip title={message}>
    <span style={{ position: 'absolute', right: '5px', top: '15%' }}>
      <SvgIcon path={mdiAlertOutline} size={muiIconSizes.small} />
    </span>
  </Tooltip>
)
