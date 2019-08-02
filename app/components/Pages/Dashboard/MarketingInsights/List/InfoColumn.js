import React from 'react'

import { formatDate } from 'components/DateTimePicker/helpers'

import Recipients from './Recipients'
import { show_title, isEmailScheduled, isEmailInProgress } from './helpers'
import { Link, Info, StyledBadge } from './styled'

function InfoColumn({ data }) {
  const isScheduled = isEmailScheduled(data)
  const isInProgress = isEmailInProgress(data)

  const title = (
    <div className="info-title">
      <div>{show_title(data.subject)}</div>
      <div>
        {isInProgress && (
          <StyledBadge appearance="warning">In Progress</StyledBadge>
        )}
      </div>
    </div>
  )
  let subTitle
  let titleRenderer

  if (isScheduled || isInProgress) {
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
