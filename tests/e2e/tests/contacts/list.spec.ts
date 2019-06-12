import { Browser, Page } from 'puppeteer'

import cuid from 'cuid'

import { init, getTestSelector } from '../../helpers'
import {
  navigateRelative,
  clickAndWait,
  clickAndType,
  getElProp,
  acceptConfirmationModal,
  waitFor2xxResponse,
  waitForRemove
} from '../../helpers/page'
import { signIn } from '../../helpers/auth'
import { addNewTag } from './add-new-tag'
import { removeTag } from '../tag-management/remove-tag'
import { createList } from './create-list'
import { expandShowMoreLess } from './expand-show-more-less'

describe('Contacts list page', () => {
  let browser: Browser
  let page: Page

  // Contact list name and selector to create, work with and delete
  const listName = `test-list-${cuid()}`
  const listSelector = getTestSelector(`contact-list-${listName}`)

  beforeAll(async () => {
    const instances = await init()

    browser = instances.browser
    page = instances.page
    await signIn(page, undefined, false)
  })

  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    await navigateRelative(page, '/dashboard/contacts')
  })

  test('User should be able to create contacts list', async () => {
    await expandShowMoreLess(page, getTestSelector('lists-list'))

    await createList(page, listName)

    await page.waitForSelector(listSelector, {
      timeout: 20000
    })
  })

  test('User should be able to set touch reminder for a list', async () => {
    await expandShowMoreLess(page, getTestSelector('lists-list'))

    await clickAndWait(page, listSelector)

    const touchReminderInputSelector = getTestSelector('touch-reminder-input')
    const touchFrequency = (Math.floor(Math.random() * 99999) + 1).toString()

    await clickAndType(page, touchReminderInputSelector, touchFrequency)

    await page.click(getTestSelector('touch-reminder-days'))

    await waitFor2xxResponse(page)

    expect(await getElProp(page, touchReminderInputSelector, 'value')).toBe(
      touchFrequency
    )
  })

  test('User should be able to delete contacts lists', async () => {
    await expandShowMoreLess(page, getTestSelector('lists-list'))

    await page.waitForSelector(listSelector)
    await page.hover(listSelector)

    const deleteListSelector = `${listSelector} ${getTestSelector(
      'delete-list'
    )}`

    await page.waitForSelector(deleteListSelector)
    await page.click(deleteListSelector)

    await acceptConfirmationModal(page)

    await waitForRemove(page, listSelector)
  })

  test('Tags are always updated after a new tag is added to a contact', async () => {
    // navigate to contacts list page

    const tagName = `test-tag-${Math.floor(Math.random() * 10 ** 6)}`

    // Expand tags to ensure all of them exist in dom
    await expandShowMoreLess(page, getTestSelector('tags-list'))

    await addNewTag(page, tagName)

    // Assert that the new tag exists in tags section in side menu
    await checkTagExistsInList(page, tagName)

    // Remove the new tag
    await navigateToTagManagementAndRemoveTheTag(page, tagName)

    await navigateRelative(page, '/dashboard/contacts')
    // Add tag again and check if it's added to the list of tags
    await addNewTag(page, tagName)
    // Expand tags to ensure all of them exist in dom
    await expandTags(page)
    await checkTagExistsInList(page, tagName)

    // cleanup. can be removed when sandbox environment for tests are added
    await navigateToTagManagementAndRemoveTheTag(page, tagName)
  })
})

async function navigateToTagManagementAndRemoveTheTag(page, tagName) {
  await navigateRelative(page, '/dashboard/account/manage-tags')
  await removeTag(page, tagName)
}

async function checkTagExistsInList(page: Page, tagName) {
  // Assert that the new tag exists in tags section in side menu
  await page.waitForSelector(getTestSelector(`tag-item-${tagName}`), {
    timeout: 10000
  })
}
