import React from 'react'

import moment from 'moment'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import Tooltip from 'components/tooltip'

import { LastActivity } from './styled'

const normalizeActivityComment = comment => comment.replace(/\./gi, '')

export function Activity(props) {
  return (
    <div onClick={props.onSelectTask}>
      {!props.latestActivity && <LastActivity>No Activity</LastActivity>}

      {props.latestActivity && props.latestActivity.comment && (
        <LastActivity>
          <Tooltip
            placement="bottom"
            caption={moment
              .unix(props.latestActivity.created_at)
              .format('MMM DD, YYYY, hh:mm A')}
          >
            <span>
              {moment.unix(props.latestActivity.created_at).fromNow()}
              ,&nbsp;
            </span>
          </Tooltip>

          <TextMiddleTruncate
            text={normalizeActivityComment(props.latestActivity.comment)}
            maxLength={60}
            tooltipPlacement="bottom"
          />
        </LastActivity>
      )}
    </div>
  )
}
