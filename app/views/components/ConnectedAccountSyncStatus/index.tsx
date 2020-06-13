import * as React from 'react'

import { Tooltip, IconButton } from '@material-ui/core'

import IconCalendar from 'components/SvgIcons/Calendar2/IconCalendar'
import IconEmail from 'components/SvgIcons/EmailOutlined/IconEmailOutlined'
import IconContact from 'components/SvgIcons/Contacts/IconContacts'

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
      (account.type === 'google_credential' ? 'gmail' : 'outlook')
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
            <IconCalendar />
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
            <IconEmail />
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
            <IconContact />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}
