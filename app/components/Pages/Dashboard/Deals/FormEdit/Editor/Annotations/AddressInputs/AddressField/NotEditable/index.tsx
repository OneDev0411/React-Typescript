import React from 'react'

import { Tooltip } from '@material-ui/core'

import { getTextAlignment } from '@app/components/Pages/Dashboard/Deals/utils/get-text-alignment'

interface Props {
  style: React.CSSProperties
  value: string
  annotation: IFormAnnotation
}

export function NotEditable({ style, value, annotation }: Props) {
  return (
    <div
      style={{
        ...style,
        cursor: 'not-allowed',
        textAlign: getTextAlignment(annotation)
      }}
    >
      <Tooltip
        title={
          <div>
            <img
              src="/static/images/deals/lock.svg"
              alt="locked"
              style={{
                display: 'block',
                margin: '10px auto'
              }}
            />
            <div>
              Listing information can only be changed on MLS. Once changed, the
              update will be reflected here.
            </div>
          </div>
        }
      >
        <span>{value}</span>
      </Tooltip>
    </div>
  )
}
