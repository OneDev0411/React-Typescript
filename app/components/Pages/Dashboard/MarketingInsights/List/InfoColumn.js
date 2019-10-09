import React from 'react'

import { formatDate } from 'components/DateTimePicker/helpers'

import { EditEmailButton } from 'components/EditEmailButton'

import Recipients from './Recipients'
import { isEmailInProgress, isEmailScheduled, show_title } from './helpers'
import { Info, StyledBadge, StyledLink } from './styled'

function InfoColumn({ data, reloadList = undefined }) {
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
    titleRenderer = (
      <EditEmailButton emailId={data.id} onEmailUpdated={reloadList}>
        {({ onClick }) => <StyledLink onClick={onClick}>{title}</StyledLink>}
      </EditEmailButton>
    )
  } else {
    subTitle = formatDate(new Date(data.executed_at * 1000))
    titleRenderer = (
      <StyledLink to={isScheduled ? '' : `/dashboard/insights/${data.id}`}>
        {title}
      </StyledLink>
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
