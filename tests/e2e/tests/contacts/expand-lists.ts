import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'

export async function expandLists(contactsPage: Page) {
  const showMore = await contactsPage.$(
    `${getTestSelector('lists-list')} ${getTestSelector('show-more-button')}`
  )

  if (showMore) {
    await showMore.click()
  }
}
