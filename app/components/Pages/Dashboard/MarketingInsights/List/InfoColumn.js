import React from 'react'

import { formatDate } from 'components/DateTimePicker/helpers'

import Recipients from './Recipients'
import { show_title } from './helpers'
import { Link, Info, StyledBadge } from './styled'

function InfoColumn({ data }) {
  // due_at is when we are going to send email. (set by client)
  const now = new Date().getTime()
  const isQueued = data.due_at * 1000 > now
  const isScheduled = !data.executed_at && isQueued
  const isInProggress = !data.executed_at && !isQueued

  // This is a workaround and we don't acutually need to detect scheduled email here.
  // In phase 2, we are going to have a separate table and page so this code will clean up in there.
  const title = (
    <div className="info-title">
      <div>{show_title(data.subject)}</div>
      <div>
        {isScheduled && <StyledBadge appearance="gray">Scheduled</StyledBadge>}
        {isInProggress && (
          <StyledBadge appearance="gray">In Progress</StyledBadge>
        )}
      </div>
    </div>
  )
  let subTitle
  let titleRenderer

  if (isScheduled || isInProggress) {
    const date = formatDate(new Date(data.due_at * 1000))

    subTitle = isScheduled ? `Scheduled for ${date}` : date
    titleRenderer = title
  } else {
    subTitle = formatDate(new Date(data.executed_at * 1000))
    titleRenderer = (
      <Link to={isScheduled ? '' : `/dashboard/insights/${data.id}`}>
        {title}
      </Link>
    )
  }

  return (
    <>
      {titleRenderer}
      <Info>
        <div className="sub-info">{subTitle}</div>
        <div className="main-info">
          <Recipients data={data.recipients} />
        </div>
      </Info>
    </>
  )
}

export default InfoColumn
