import React, { ReactNode } from 'react'

import { Box, Typography } from '@material-ui/core'

import { EditEmailButton } from 'components/EditEmailButton'

import { isEmailFailed, isEmailInProgress, isEmailScheduled } from '../helpers'
import { StyledBadge, StyledLink } from '../styled'
import Date from './Date'

interface Props {
  data: IEmailCampaign
  reloadList: () => void
}

function TitleColumn({ data, reloadList }) {
  const isFailed: boolean = isEmailFailed(data)
  const isScheduled: boolean = isEmailScheduled(data)
  const isInProgress: boolean = isEmailInProgress(data)
  let titleRenderer: ReactNode

  const title = (
    <div className="info-title">
      <Box pr={2} maxWidth="100%">
        <Typography noWrap>{data.subject}</Typography>
      </Box>
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
      <StyledLink to={`/dashboard/insights/${data.id}`}>{title}</StyledLink>
    )
  }

  return (
    <>
      {titleRenderer}
      <Box>
        <Date data={data} />
        {isFailed && <StyledBadge appearance="red">Failed</StyledBadge>}
        {isInProgress && (
          <StyledBadge appearance="warning">In Progress</StyledBadge>
        )}
      </Box>
    </>
  )
}

export default TitleColumn
