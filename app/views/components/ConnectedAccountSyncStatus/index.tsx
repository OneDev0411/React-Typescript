import { useMemo } from 'react'

import { Tooltip, Typography, TypographyProps } from '@material-ui/core'
import pluralize from 'pluralize'
import timeago from 'timeago.js'

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

  const status = useMemo(
    () =>
      (account.type === 'Realtor' || account.type === 'Zillow') &&
      account.threads_total
        ? `${account.threads_total} ${pluralize(
            'lead',
            account.threads_total
          )} captured`
        : lastSyncAt
        ? `Synced ${timeago().format(lastSyncAt)}`
        : 'Not synced yet',
    [account.threads_total, account.type, lastSyncAt]
  )

  const tooltipTitle = useMemo(() => {
    return (
      <>
        {contactsJob && (
          <div>
            Contacts are
            {`${contactsJob?.status === 'success' ? ' synced' : ' syncing'}`}
          </div>
        )}
        {emailsJob && (
          <div>
            Emails are
            {emailsJob?.status === 'success' ? ' synced' : ' syncing'}
          </div>
        )}
        {calendarJob && (
          <div>
            Calendar is
            {`${calendarJob?.status === 'success' ? ' synced' : ' syncing'}`}
          </div>
        )}
      </>
    )
  }, [calendarJob, contactsJob, emailsJob])

  return (
    <Tooltip title={tooltipTitle}>
      <Typography className={className} variant={variant}>
        {status}
      </Typography>
    </Tooltip>
  )
}
