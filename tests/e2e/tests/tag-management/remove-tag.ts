import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'

export async function removeTag(tagManagementPage: Page, tag: string) {
  const tagElement = await tagManagementPage.waitForSelector(
    getTestSelector(`tag-item-${tag}`),
    { timeout: 5000 }
  )

  expect(tagElement).not.toBeNull()

  const deleteButton = await tagElement!.$('button')

  await deleteButton!.click()

  const confirmButton = await tagManagementPage.waitForSelector(
    getTestSelector('confirmation-modal-confirm-button')
  )

  await confirmButton.click()

  await tagManagementPage.waitForResponse(() => true)
}
