import { InsightFiltersType } from './types'

export function percent(num, allNum) {
  if (num === 0 || allNum === 0) {
    return 0
  }

  return Math.floor((num * 100) / allNum)
}

export function recipientsList(recipients) {
  const list = []
  const tags = []
  const contacts = []
  const emails = []

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

export function show_title(title) {
  return title ? title.trim() : 'No Title'
}

export function isEmailQueued(item) {
  const now = new Date().getTime()
  return item.due_at * 1000 > now
}

export function isEmailScheduled(item) {
  return !item.executed_at && isEmailQueued(item)
}

export function isEmailInProgress(item) {
  return !item.executed_at && !isEmailQueued(item)
}

export function doFilterOnInsightList(
  list,
  type: InsightFiltersType = InsightFiltersType.SENT
) {
  // Defining a muatable const :D
  const output = {
    list: [],
    stats: {
      scheduled: 0,
      sent: 0
    }
  }

  // Filtering based on types
  if (type === InsightFiltersType.SCHEDULED) {
    output.list = list.filter(function filterInsightList(item) {
      return isEmailScheduled(item)
    })

    output.stats = {
      sent: list.length - output.list.length,
      scheduled: output.list.length
    }
  }

  if (type === InsightFiltersType.SENT) {
    output.list = list.filter(function filterInsightList(item) {
      return !isEmailScheduled(item)
    })

    output.stats = {
      sent: output.list.length,
      scheduled: list.length - output.list.length
    }
  }

  // Returning final output
  return output
}
