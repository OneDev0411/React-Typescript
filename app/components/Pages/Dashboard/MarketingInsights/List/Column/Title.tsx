import React, { ReactNode } from 'react'

import { EditEmailButton } from 'components/EditEmailButton'

import { isEmailInProgress, isEmailScheduled, show_title } from '../helpers'
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
      <div>{show_title(data.subject)}</div>
      {isInProgress && (
        <div>
          <StyledBadge appearance="warning">In Progress</StyledBadge>
        </div>
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
        {({ onClick }) => <span onClick={onClick}>{title}</span>}
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
