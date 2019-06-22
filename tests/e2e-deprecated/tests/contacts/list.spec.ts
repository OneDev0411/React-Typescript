import { Browser, Page } from 'puppeteer'

import cuid from 'cuid'

import { getTestSelector, init } from '../../helpers'
import {
  clickAndType,
  clickAndWait,
  getElProp,
  navigateRelative,
  waitFor2xxResponse
} from '../../helpers/page'
import { signIn } from '../../helpers/auth'
import { addNewTag } from './add-new-tag'
import { removeTag } from '../tag-management/remove-tag'
import { createList } from './create-list'
import { expandShowMoreLess } from './expand-show-more-less'
import { removeList } from './remove-list'

describe('Contacts list page', () => {
  let browser: Browser
  let page: Page

  // Contact list name and selector to create, work with and delete
  const listName = `test-list-${cuid()}`
  const secondListName = `test-list-${cuid()}`
  const listSelector = getTestSelector(`contact-list-${listName}`)
  const secondListSelector = getTestSelector(`contact-list-${secondListName}`)

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
    await createList(page, secondListName)

    await page.waitForSelector(listSelector, {
      timeout: 20000
    })
  })

  test('User should be able to set touch reminder for a list', async () => {
    await expandShowMoreLess(page, getTestSelector('lists-list'))

    await clickAndWait(page, listSelector)

    const touchReminderInputSelector = getTestSelector('touch-reminder-input')
    const touchFrequency = '34'

    await clickAndType(page, touchReminderInputSelector, touchFrequency)

    await page.click(getTestSelector('touch-reminder-days'))

    await waitFor2xxResponse(page)

    expect(await getElProp(page, touchReminderInputSelector, 'value')).toBe(
      touchFrequency
    )

    await clickAndWait(page, secondListSelector)

    expect(await getElProp(page, touchReminderInputSelector, 'value')).not.toBe(
      touchFrequency
    )
  })

  test('User should be able to delete contacts lists', async () => {
    await removeList(page, listName)
    await removeList(page, secondListName)
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
    await expandShowMoreLess(page, getTestSelector('tags-list'))
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
    timeout: 20000
  })
}
