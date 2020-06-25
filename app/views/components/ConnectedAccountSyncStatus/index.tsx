import React from 'react'
import { Tooltip, IconButton } from '@material-ui/core'
import { mdiCalendarOutline, mdiEmailOutline } from '@mdi/js'

import { GOOGLE_CREDENTIAL } from 'constants/oauth-accounts'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { permContactCalendarOutlined } from 'components/SvgIcons/icons'

interface Props {
  account: IOAuthAccount
}

export function ConnectedAccountSyncStatus({ account }: Props) {
  const calendarJob = (account.jobs || []).find(
    job => job.job_name === 'calendar'
  )
  const contactsJob = (account.jobs || []).find(
    job => job.job_name === 'contacts'
  )
  const emailsJob = (account.jobs || []).find(
    job =>
      job.job_name ===
      (account.type === GOOGLE_CREDENTIAL ? 'gmail' : 'outlook')
  )

  return (
    <div>
      {calendarJob && (
        <Tooltip
          title={`Calendar is ${
            calendarJob?.status === 'success' ? 'synced' : 'syncing'
          }`}
        >
          <IconButton>
            <SvgIcon path={mdiCalendarOutline} />
          </IconButton>
        </Tooltip>
      )}

      {emailsJob && (
        <Tooltip
          title={`Emails are ${
            emailsJob?.status === 'success' ? 'synced' : 'syncing'
          } `}
        >
          <IconButton>
            <SvgIcon path={mdiEmailOutline} />
          </IconButton>
        </Tooltip>
      )}

      {contactsJob && (
        <Tooltip
          title={`Contacts are ${
            contactsJob?.status === 'success' ? 'synced' : 'syncing'
          } `}
        >
          <IconButton>
            <SvgIcon path={permContactCalendarOutlined} />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
