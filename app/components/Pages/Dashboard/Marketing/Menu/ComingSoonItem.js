import React from 'react'

import { grey } from 'views/utils/colors'
import Tooltip from 'components/tooltip'

export function ComingSoonItem(props) {
  return (
    <Tooltip caption="Coming Soon!" placement="right">
      <p style={{ color: grey.A900 }}>{props.text}</p>
    </Tooltip>
  )
}
