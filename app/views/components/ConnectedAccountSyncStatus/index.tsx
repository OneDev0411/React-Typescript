import React from 'react'

import { Tooltip, IconButton } from '@material-ui/core'
import { mdiCalendarOutline, mdiEmailOutline } from '@mdi/js'

import { permContactCalendarOutlined } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { GOOGLE_CREDENTIAL } from 'constants/oauth-accounts'

interface Props {
  account: IOAuthAccount
  size?: 'small' | 'medium'
  className?: string
  buttonsClassName?: string
}

export function ConnectedAccountSyncStatus({
  account,
  size,
  className = '',
  buttonsClassName = ''
}: Props) {
  const contactsJob = (account.jobs || []).find(
    job => job.job_name === 'contacts'
  )
  const emailsJob = (account.jobs || []).find(
    job =>
      job.job_name ===
      (account.type === GOOGLE_CREDENTIAL ? 'gmail' : 'outlook')
  )
  const calendarJob = (account.jobs || []).find(
    job => job.job_name === 'calendar'
  )

  return (
    <div className={className}>
      {contactsJob && (
        <Tooltip
          title={`Contacts are ${
            contactsJob?.status === 'success' ? 'synced' : 'syncing'
          } `}
        >
          <IconButton className={buttonsClassName} size={size}>
            <SvgIcon path={permContactCalendarOutlined} />
          </IconButton>
        </Tooltip>
      )}

      {emailsJob && (
        <Tooltip
          title={`Emails are ${
            emailsJob?.status === 'success' ? 'synced' : 'syncing'
          } `}
        >
          <IconButton className={buttonsClassName} size={size}>
            <SvgIcon path={mdiEmailOutline} />
          </IconButton>
        </Tooltip>
      )}

      {calendarJob && (
        <Tooltip
          title={`Calendar is ${
            calendarJob?.status === 'success' ? 'synced' : 'syncing'
          }`}
        >
          <IconButton className={buttonsClassName} size={size}>
            <SvgIcon path={mdiCalendarOutline} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
