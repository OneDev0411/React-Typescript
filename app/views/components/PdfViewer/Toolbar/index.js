import React from 'react'
import {
  mdiPlusCircleOutline,
  mdiProgressDownload,
  mdiMinusCircleOutline
} from '@mdi/js'
import { useTheme } from '@material-ui/core/styles'

import { Tooltip } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { rotateRightIcon, fitToPageIcon } from 'components/SvgIcons/icons'

import { Container, MenuItem } from './styled'

export function Toolbar(props) {
  const theme = useTheme()

  return (
    <Container>
      <MenuItem>
        <Tooltip placement="bottom" title="Download File">
          <a target="_blank" href={props.downloadLink}>
            <SvgIcon
              path={mdiProgressDownload}
              color={theme.palette.common.black}
            />
          </a>
        </Tooltip>
      </MenuItem>

      <MenuItem onClick={props.onZoomIn}>
        <Tooltip placement="bottom" title="Zoom In">
          <SvgIcon path={mdiPlusCircleOutline} />
        </Tooltip>
      </MenuItem>

      <MenuItem onClick={props.onZoomOut}>
        <Tooltip placement="bottom" title="Zoom Out">
          <SvgIcon path={mdiMinusCircleOutline} />
        </Tooltip>
      </MenuItem>

      <MenuItem>
        <Tooltip placement="bottom" title="Fit Window">
          <SvgIcon path={fitToPageIcon} onClick={props.onFitWindow} />
        </Tooltip>
      </MenuItem>

      <MenuItem onClick={props.onRotate}>
        <Tooltip placement="bottom" title="Rotate Page">
          <SvgIcon path={rotateRightIcon} />
        </Tooltip>
      </MenuItem>
    </Container>
  )
}
