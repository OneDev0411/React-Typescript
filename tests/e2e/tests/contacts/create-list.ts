import { Page } from 'puppeteer'

import { getTestSelector, getFirstChildOfTestSelector } from '../../helpers'

export async function createList(contactsPage: Page, listName: string) {
  const addFilterButton = await contactsPage.waitForSelector(
    getTestSelector('add-filter')
  )

  await addFilterButton.click()

  const addTagFilterItemButton = await contactsPage.waitForSelector(
    getTestSelector('add-filter-item-Tag')
  )

  await addTagFilterItemButton.click()

  const openFiltersListButton = await contactsPage.waitForSelector(
    getTestSelector('open-filters-list')
  )

  await openFiltersListButton.click()

  const firstTag = await contactsPage.waitForSelector(
    getFirstChildOfTestSelector('filter-items-list')
  )

  await firstTag.click()

  const filterDoneButton = await contactsPage.waitForSelector(
    getTestSelector('filter-done-button')
  )

  await filterDoneButton.click()

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
