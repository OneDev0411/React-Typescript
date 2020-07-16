import React from 'react'
import { mdiMagnify } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

export default ({ description }) => (
  <div className="table-container">
    <div className="list-empty">
      <SvgIcon path={mdiMagnify} size="100px" />
      <div className="title">No Results</div>
      <div className="descr">{description}</div>
    </div>
  </div>
)
