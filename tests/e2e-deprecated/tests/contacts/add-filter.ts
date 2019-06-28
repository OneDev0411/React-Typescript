import { Page } from 'puppeteer'

import { getTestSelector, getFirstChildOfTestSelector } from '../../helpers'

export async function addTagFilter(contactsPage: Page) {
  await openNewFilterDropdown(contactsPage, 'Tag')

  const openFiltersListButton = await contactsPage.waitForSelector(
    getTestSelector('open-filters-list')
  )

  await openFiltersListButton.click()

  // we can add more options for selecting tag and operator

  const firstTag = await contactsPage.waitForSelector(
    getFirstChildOfTestSelector('filter-items-list')
  )

  await firstTag.click()

  const filterDoneButton = await contactsPage.waitForSelector(
    getTestSelector('filter-done-button')
  )

  await filterDoneButton.click()
}
export async function addOpenHouseFilter(contactsPage: Page) {
  await openNewFilterDropdown(contactsPage, 'Open House')

  const item = await contactsPage.waitForSelector(
    getTestSelector('filter-item')
  )

  await item.click()
}

async function openNewFilterDropdown(contactsPage: Page, filterType: string) {
  const addFilterButton = await contactsPage.waitForSelector(
    getTestSelector('add-filter')
  )

  await addFilterButton.click()

  const addTagFilterItemButton = await contactsPage.waitForSelector(
    getTestSelector(`add-filter-item-${filterType}`)
  )

  await addTagFilterItemButton.click()
}
