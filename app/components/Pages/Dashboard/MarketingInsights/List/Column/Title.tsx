import React, { ReactNode } from 'react'

import { EditEmailButton } from 'components/EditEmailButton'

import { isEmailInProgress, isEmailScheduled, truncateString } from '../helpers'
import { StyledBadge, StyledLink } from '../styled'

interface Props {
  data: IEmailCampaign
  reloadList: () => void
}

function TitleColumn({ data, reloadList }) {
  const isScheduled: boolean = isEmailScheduled(data)
  const isInProgress: boolean = isEmailInProgress(data)
  let titleRenderer: ReactNode

  const title = (
    <div className="info-title">
      <div>{truncateString(data.subject, 30)}</div>
      {isInProgress && (
        <StyledBadge appearance="warning">In Progress</StyledBadge>
      )}
    </div>
  )

  if (isScheduled || isInProgress) {
    titleRenderer = (
      <EditEmailButton
        emailId={data.id}
        onEmailUpdated={reloadList}
        onDeleted={reloadList}
      >
        {({ onClick }) => <div onClick={onClick}>{title}</div>}
      </EditEmailButton>
    )
  } else {
    titleRenderer = (
      <StyledLink to={isScheduled ? '' : `/dashboard/insights/${data.id}`}>
        {title}
      </StyledLink>
    )
  }

  return titleRenderer
}

export default TitleColumn
