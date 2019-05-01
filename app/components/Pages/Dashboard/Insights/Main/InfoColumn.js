import React from 'react'

import { formatDate } from 'components/DateTimePicker/helpers'

import { show_title } from './helpers'
import { Link, Info, StyledBadge } from './styled'
import Recipients from './Recipients'

function InfoColumn(props) {
  const isScheduled = !props.data.executed_at
  const title = (
    <>
      {show_title(props.data.subject)}
      {isScheduled && <StyledBadge appearance="success">Scheduled</StyledBadge>}
    </>
  )
  let subTitle
  let titleRenderer

  if (isScheduled) {
    subTitle = `Scheduled for ${formatDate(new Date(props.data.due_at * 1000))}`
    titleRenderer = title
  } else {
    subTitle = formatDate(new Date(props.data.executed_at * 1000))
    titleRenderer = (
      <Link
        to={isScheduled ? '' : `/dashboard/insights/campaigns/${props.data.id}`}
      >
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
          <Recipients data={props.data.recipients} />
        </div>
      </Info>
    </>
  )
}

export default InfoColumn
