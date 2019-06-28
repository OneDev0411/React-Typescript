import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'

export async function expandShowMoreLess(
  contactsPage: Page,
  parentSelector: string
) {
  const showMore = await contactsPage.$(
    `${parentSelector} ${getTestSelector('show-more-button')}`
  )

  if (showMore) {
    await showMore.click()
  }
}
