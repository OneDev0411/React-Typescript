import React from 'react'

import moment from 'moment'

import { Tooltip } from '@material-ui/core'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { LastActivity } from './styled'

interface Props {
  task: IDealTask
  onClick: () => void
}

export function Activity({ task, onClick }: Props) {
  const latestActivity = task.room.latest_activity

  if (!latestActivity || !latestActivity.comment) {
    return null
  }

  return (
    <LastActivity onClick={onClick}>
      <Tooltip
        placement="bottom"
        title={moment
          .unix(latestActivity.created_at)
          .format('MMM DD, YYYY, hh:mm A')}
      >
        <span
          style={{
            textTransform: 'capitalize'
          }}
        >
          {moment.unix(latestActivity.created_at).fromNow()}
          ,&nbsp;
        </span>
      </Tooltip>

      <TextMiddleTruncate
        text={latestActivity.comment}
        maxLength={50}
        tooltipPlacement="bottom"
      />
    </LastActivity>
  )
}
