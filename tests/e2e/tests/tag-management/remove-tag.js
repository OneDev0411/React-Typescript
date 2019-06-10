import { testSelector } from '../../helpers'

export async function removeTag(tagManagementPage, tag) {
  const addedTagElem = await tagManagementPage.$(
    testSelector(`tag-item-${tag}`)
  )

  const deleteButton = await addedTagElem.$('button')

  await deleteButton.click()

  const confirmButton = await tagManagementPage.waitForSelector(
    testSelector('confirmation-modal-confirm-button')
  )

  await confirmButton.click()

  await tagManagementPage.waitForResponse(() => true)
}
