import { EmailStatType, ContactsListType } from './types'

export function getContactStat(email: IEmailCampaignEmail): EmailStatType {
  return {
    unsubscribed: email.unsubscribed,
    failed: email.failed,
    opened: email.opened,
    clicked: email.clicked
  }
}

export function contactsList(
  item: IEmailCampaign<IEmailCampaignAssociation>
): ContactsListType[] {
  const emails = item.emails

  if (!Array.isArray(emails)) {
    return []
  }

  return emails.map(email => ({
    // This is using for mini contact
    original_data: email,
    id: email.id,
    display_name: email.full_name,
    profile_image_url: email.profile_image_url,
    to: email.email_address,
    contact: email.contact,
    ...getContactStat(email)
  }))
}

export enum SortValues {
  ALPHABETICAL = 'ALPHABETICAL',
  BOUNCED = 'BOUNCED',
  MOST_CLICKED = 'MOST_CLICKED',
  MOST_OPENED = 'MOST_OPENED',
  UNSUBSCRIBED = 'UNSUBSCRIBED'
}

export function doSort(list: ContactsListType[], sort_value: SortValues) {
  const sort = SortValues[sort_value]

  if (sort === SortValues.ALPHABETICAL) {
    return list.sort(function alphabeticalSort(a, b) {
      // if a data has not display_name, we are sorting it to the end of list
      const aName = a.display_name
      const bName = b.display_name

      // Sorry, aName === null part is for satisfying TS :(
      if (aName === null || !aName) {
        return 1
      }

      if (bName === null || !bName) {
        return -1
      }

      if (aName < bName) {
        return -1
      }

      if (aName > bName) {
        return 1
      }

      return 0
    })
  }

  if (sort === SortValues.BOUNCED) {
    return list.sort(function bouncedSort(a, b) {
      return b.failed - a.failed
    })
  }

  if (sort === SortValues.MOST_CLICKED) {
    return list.sort(function bouncedSort(a, b) {
      return b.clicked - a.clicked
    })
  }

  if (sort === SortValues.MOST_OPENED) {
    return list.sort(function bouncedSort(a, b) {
      return b.opened - a.opened
    })
  }

  if (sort === SortValues.UNSUBSCRIBED) {
    return list.sort(function bouncedSort(a, b) {
      return b.unsubscribed - a.unsubscribed
    })
  }

  return list
}
