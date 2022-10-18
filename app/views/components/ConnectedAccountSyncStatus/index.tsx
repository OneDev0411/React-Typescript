import { useMemo } from 'react'

import { Tooltip, Typography, TypographyProps } from '@material-ui/core'
import pluralize from 'pluralize'
import timeago from 'timeago.js'

import { isValidLeadChannelSource } from '@app/components/Pages/Dashboard/Account/ConnectedAccounts/ConnectedLeadChannels/helpers/is-valid-lead-channel-source'
import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

interface Props {
  account: IOAuthAccount
  variant?: TypographyProps['variant']
  className?: string
}

export function ConnectedAccountSyncStatus({
  account,
  variant = 'body1',
  className = ''
}: Props) {
  const isLeadChannel = useMemo(
    () => isValidLeadChannelSource(account.type),
    [account.type]
  )
  const contactsJob = useMemo(
    () => (account.jobs || []).find(job => job.job_name === 'contacts'),
    [account.jobs]
  )

  const emailsJob = useMemo(
    () =>
      (account.jobs || []).find(
        job =>
          job.job_name ===
          (account.type === GOOGLE_CREDENTIAL
            ? 'gmail'
            : account.type === MICROSOFT_CREDENTIAL
            ? 'outlook'
            : 'email')
      ),
    [account.jobs, account.type]
  )

  const calendarJob = useMemo(
    () => (account.jobs || []).find(job => job.job_name === 'calendar'),
    [account.jobs]
  )

  const lastSyncAt = useMemo(
    () =>
      Math.max(
        contactsJob ? new Date(contactsJob.start_at).getTime() : 0,
        calendarJob ? new Date(calendarJob.start_at).getTime() : 0,
        emailsJob ? new Date(emailsJob.start_at).getTime() : 0
      ),
    [calendarJob, contactsJob, emailsJob]
  )

  const status = useMemo(() => {
    if (isLeadChannel) {
      return account.threads_total
        ? `${account.threads_total} ${pluralize(
            'lead',
            account.threads_total
          )} captured`
        : 'Not synced yet'
    }

    return lastSyncAt
      ? `Synced ${timeago().format(lastSyncAt)}`
      : 'Not synced yet'
  }, [account.threads_total, isLeadChannel, lastSyncAt])

  const tooltipTitle = useMemo(() => {
    if (isLeadChannel) {
      return account.threads_total ? 'Leads are synced' : 'Not synced yet'
    }

    const jobsList = [
      {
        label: 'Contacts are',
        job: contactsJob
      },
      {
        label: 'Emails are',
        job: emailsJob
      },
      {
        label: 'Calendar is',
        job: calendarJob
      }
    ]

    return (
      <>
        {jobsList.map(item => (
          <div key={item.label}>
            {`${item.label} ${
              item.job?.status === 'success' ? ' synced' : ' syncing'
            }`}
          </div>
        ))}
      </>
    )
  }, [
    isLeadChannel,
    contactsJob,
    emailsJob,
    calendarJob,
    account.threads_total
  ])

  return (
    <Tooltip title={tooltipTitle}>
      <Typography className={className} variant={variant}>
        {status}
      </Typography>
    </Tooltip>
  )
}
