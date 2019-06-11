import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'

export async function expandTags(contactsPage: Page) {
  const showMore = await contactsPage.$(
    `${getTestSelector('tags-list')} ${getTestSelector('show-more-button')}`
  )

  if (showMore) {
    await showMore.click()
  }
}
