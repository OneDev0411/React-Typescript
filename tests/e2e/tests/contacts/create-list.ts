import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'
import { addOpenHouseFilter } from './add-filter'

export async function createList(contactsPage: Page, listName: string) {
  await addOpenHouseFilter(contactsPage)

  const saveListButton = await contactsPage.waitForSelector(
    getTestSelector('save-list-button')
  )

  await saveListButton.click()

  await contactsPage.type(getTestSelector('new-list-name-input'), listName)

  const saveListButtonModal = await contactsPage.waitForSelector(
    getTestSelector('save-list-button-modal')
  )

  await saveListButtonModal.click()
}
