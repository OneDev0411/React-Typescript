import React from 'react'

import { ButtonBase, Tooltip } from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  style: React.CSSProperties
  onClick: () => void
}

export function UnlinkFieldButton({ style, onClick }: Props) {
  return (
    <Tooltip title="Convert field to plain text">
      <ButtonBase
        className="button-visible-on-hover"
        style={{
          position: 'absolute',
          cursor: 'pointer',
          width: '16px',
          color: '#fff',
          backgroundColor: 'rgb(33, 118, 203)',
          borderRadius: '0 4px 4px 0',
          ...style
        }}
        onClick={onClick}
      >
        <SvgIcon path={mdiDotsHorizontal} size={muiIconSizes.xsmall} />
      </ButtonBase>
    </Tooltip>
  )
}
