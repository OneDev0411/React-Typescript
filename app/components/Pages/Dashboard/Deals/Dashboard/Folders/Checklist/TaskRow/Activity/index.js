import React from 'react'

import moment from 'moment'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import Tooltip from 'components/tooltip'

import { LastActivity } from './styled'

export function Activity(props) {
  if (!props.latestActivity || !props.latestActivity.comment) {
    return false
  }

  return (
    <LastActivity onClick={props.onClick}>
      <Tooltip
        placement="bottom"
        caption={moment
          .unix(props.latestActivity.created_at)
          .format('MMM DD, YYYY, hh:mm A')}
      >
        <span
          style={{
            textTransform: 'capitalize'
          }}
        >
          {moment.unix(props.latestActivity.created_at).fromNow()}
          ,&nbsp;
        </span>
      </Tooltip>

      <TextMiddleTruncate
        text={props.latestActivity.comment}
        maxLength={50}
        tooltipPlacement="bottom"
      />
    </LastActivity>
  )
}
