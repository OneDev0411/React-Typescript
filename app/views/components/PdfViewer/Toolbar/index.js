import React from 'react'

import Tooltip from 'components/tooltip'
import { Container, MenuItem } from './styled'

export function Toolbar(props) {
  return (
    <Container>
      <MenuItem onClick={props.onRotate}>
        <Tooltip placement="left" caption="Rotate Page">
          <i className="fa fa-rotate-right" />
        </Tooltip>
      </MenuItem>

      <MenuItem onClick={props.onZoomIn}>
        <Tooltip placement="left" caption="Zoom In">
          <i className="fa fa-plus-circle" />
        </Tooltip>
      </MenuItem>

      <MenuItem onClick={props.onZoomOut}>
        <Tooltip placement="left" caption="Zoom Out">
          <i className="fa fa-minus-circle" />
        </Tooltip>
      </MenuItem>

      <MenuItem>
        <Tooltip placement="left" caption="Fit Window">
          <i className="fa fa-square-o" onClick={props.onFitWindow} />
        </Tooltip>
      </MenuItem>

      <MenuItem>
        <Tooltip placement="left" caption="Download File">
          <a target="_blank" href={props.downloadLink}>
            <i className="fa fa-download" />
          </a>
        </Tooltip>
      </MenuItem>
    </Container>
  )
}
