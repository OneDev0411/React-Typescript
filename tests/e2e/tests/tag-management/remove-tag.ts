import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'

export async function removeTag(tagManagementPage: Page, tag: string) {
  const addedTagElem = await tagManagementPage.$(
    getTestSelector(`tag-item-${tag}`)
  )

  expect(addedTagElem).not.toBeNull()

  const deleteButton = await addedTagElem!.$('button')

  await deleteButton!.click()

  const confirmButton = await tagManagementPage.waitForSelector(
    getTestSelector('confirmation-modal-confirm-button')
  )

  await confirmButton.click()

  await tagManagementPage.waitForResponse(() => true)
}
