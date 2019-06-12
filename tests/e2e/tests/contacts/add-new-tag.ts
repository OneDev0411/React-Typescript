import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'

export async function addNewTag(contactsPage: Page, tagName: string) {
  const firstAddTagButton = await contactsPage.waitForSelector(
    getTestSelector('add-tag')
  )

  await firstAddTagButton.click()
  await contactsPage.type(getTestSelector('new-tag-input'), tagName)
  await contactsPage.keyboard.press('Enter')
  await contactsPage.click(getTestSelector('save-tags-button'))
}
