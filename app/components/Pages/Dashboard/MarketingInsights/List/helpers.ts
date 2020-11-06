import {
  GOOGLE_CREDENTIAL,
  MICROSOFT_CREDENTIAL
} from 'constants/oauth-accounts'

import { InsightEmailCampaign, InsightFilterType, InsightState } from './types'

export function hasPixelTracking(campaign: IEmailCampaign): boolean {
  return !!campaign[GOOGLE_CREDENTIAL] || !!campaign[MICROSOFT_CREDENTIAL]
}

export function percent(value: number, total: number): number {
  if (value === 0 || total === 0) {
    return 0
  }

  return Math.floor((value * 100) / total)
}

export function valueAndPercent(value: number, total: number): string {
  const rate = percent(value, total)

  if (rate === 0) {
    return `${value}`
  }

  return `${value} (${rate}%)`
}

export function recipientsList(recipients) {
  const list: string[] = []
  const tags: string[] = []
  const contacts: string[] = []
  const emails: string[] = []

  recipients.forEach(recipient => {
    if (recipient.tag) {
      tags.push(recipient.tag)
    } else if (recipient.list) {
      list.push(recipient.list)
    } else if (recipient.contact) {
      contacts.push(recipient.contact)
    } else {
      emails.push(recipient.email)
    }
  })

  return {
    list,
    tags,
    contacts,
    emails
  }
}

export function truncateString(title, limit = 0) {
  if (!title) {
    return 'No Subject'
  }

  const trimedTitle = title.trim()

  return limit > 0 && trimedTitle.length > limit
    ? `${trimedTitle.substring(0, limit)}...`
    : trimedTitle
}

export function isEmailQueued(item) {
  const now = new Date().getTime()

  return item.due_at * 1000 > now
}

export function isEmailFailed(item) {
  return !!item.failed_at
}

export function isEmailScheduled(item) {
  return !item.executed_at && isEmailQueued(item)
}

export function isEmailInProgress(item) {
  return !item.executed_at && !isEmailQueued(item)
}

export function filterInsightList(
  list: readonly InsightEmailCampaign[],
  type: InsightFilterType
): Pick<InsightState, 'list' | 'counts'> {
  const isSentStatus = type === InsightFilterType.SENT

  const filteredList = list.filter(item => {
    const isScheduledItem = isEmailScheduled(item)

    return isSentStatus ? !isScheduledItem : isScheduledItem
  })

  const activeFilterStats = filteredList.length
  const secondFilterStats = list.length - filteredList.length

  return {
    list: filteredList,
    counts: {
      scheduled: !isSentStatus ? activeFilterStats : secondFilterStats,
      sent: isSentStatus ? activeFilterStats : secondFilterStats
    }
  }
}
