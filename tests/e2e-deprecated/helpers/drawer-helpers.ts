import { Page } from 'puppeteer'

import { waitForRemove } from './page'

import { getTestSelector } from '.'

export const waitForDrawerToClose = (page: Page) => {
  return waitForRemove(page, getTestSelector('open-drawer-overlay'))
}

export const submitDrawerForm = async (page: Page) => {
  const drawer = await page.$(getTestSelector('open-drawer-content'))

  if (!drawer) {
    throw new Error('Could not found open drawer to submit the form')
  }

  const submitButton = await drawer.$('button[type=submit]')

  if (!submitButton) {
    throw new Error('Could not found submit button inside the open drawer')
  }

  await submitButton.click()

  await waitForDrawerToClose(page)
}
