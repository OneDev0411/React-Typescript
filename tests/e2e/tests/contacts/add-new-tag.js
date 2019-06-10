import { testSelector } from '../../helpers'

export async function addNewTag(contactsPage, tagName) {
  const firstAddTagButton = await contactsPage.waitForSelector(
    testSelector('add-tag')
  )

  await firstAddTagButton.click()
  await contactsPage.type(testSelector('new-tag-input'), tagName)
  contactsPage.keyboard.press('Enter')
  await contactsPage.click(testSelector('save-tags-button'))
}
