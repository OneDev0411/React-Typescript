import { ReactElement } from 'react'

import { Box, Tooltip } from '@material-ui/core'

import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'
import { EditEmailButton } from 'components/EditEmailButton'

import { isEmailFailed, isEmailInProgress, isEmailScheduled } from '../helpers'
import { StyledBadge, StyledLink } from '../styled'

import Date from './Date'

interface Props {
  data: IEmailCampaign
  reloadList: () => void
}

function TitleColumn({ data, reloadList }: Props) {
  const isFailed: boolean = isEmailFailed(data)
  const isScheduled: boolean = isEmailScheduled(data)
  const isInProgress: boolean = isEmailInProgress(data)
  let titleRenderer: ReactElement

  const title = (
    <div className="info-title">
      <Box pr={2} maxWidth="100%">
        <TextMiddleTruncate
          text={data.subject || '(untitled)'}
          maxLength={isScheduled ? 140 : 55}
        />
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      maxWidth="100%"
    >
      {titleRenderer}
      <Box>
        <Date data={data} />
        {isFailed && (
          <Tooltip title={data.failure || ''}>
            <StyledBadge appearance="red">Failed</StyledBadge>
          </Tooltip>
        )}
        {isInProgress && (
          <StyledBadge appearance="warning">In Progress</StyledBadge>
        )}
      </Box>
    </Box>
  )
}

export default TitleColumn
