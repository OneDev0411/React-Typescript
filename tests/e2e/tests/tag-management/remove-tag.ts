import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'
import {
  acceptConfirmationModal,
  waitFor2xxResponse,
  waitForRemove
} from '../../helpers/page'

export async function removeTag(tagManagementPage: Page, tag: string) {
  const tagElement = await tagManagementPage.waitForSelector(
    getTestSelector(`tag-item-${tag}`),
    { timeout: 5000 }
  )

  expect(tagElement).not.toBeNull()

  const deleteButton = await tagElement!.$('button')

  await deleteButton!.click()

  await acceptConfirmationModal(tagManagementPage)

  await waitForRemove(tagManagementPage, getTestSelector(`tag-item-${tag}`))
}
