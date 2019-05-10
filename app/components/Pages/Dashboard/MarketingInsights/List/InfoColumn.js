import React from 'react'

import { formatDate } from 'components/DateTimePicker/helpers'

import Recipients from './Recipients'
import { show_title } from './helpers'
import { Link, Info, StyledBadge } from './styled'

function InfoColumn({ data }) {
  const isScheduled = !data.executed_at
  const title = (
    <>
      {show_title(data.subject)}
      {isScheduled && <StyledBadge appearance="success">Scheduled</StyledBadge>}
    </>
  )
  let subTitle
  let titleRenderer

  if (isScheduled) {
    subTitle = `Scheduled for ${formatDate(new Date(data.due_at * 1000))}`
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
