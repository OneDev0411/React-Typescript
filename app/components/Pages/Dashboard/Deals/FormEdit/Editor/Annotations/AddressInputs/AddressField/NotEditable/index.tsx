import React from 'react'

import { Tooltip } from '@material-ui/core'

interface Props {
  style: React.CSSProperties
  value: string
}

export function NotEditable({ style, value }: Props) {
  return (
    <div
      style={{
        ...style,
        cursor: 'not-allowed'
      }}
    >
      <Tooltip
        title={
          <>
            <img src="/static/images/deals/lock.svg" alt="locked" />
            <div>
              Listing information can only be changed on MLS. Once changed, the
              update will be reflected here.
            </div>
          </>
        }
      >
        <span>{value}</span>
      </Tooltip>
    </div>
  )
}
