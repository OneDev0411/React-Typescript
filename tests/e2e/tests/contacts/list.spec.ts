import { Browser, Page } from 'puppeteer'

import cuid from 'cuid'

import { init, getTestSelector } from '../../helpers'
import {
  navigateRelative,
  clickAndWait,
  clickAndType,
  getElProp
} from '../../helpers/page'
import { signIn } from '../../helpers/auth'
import { expandTags } from './expand-tags'
import { expandLists } from './expand-lists'
import { addNewTag } from './add-new-tag'
import { removeTag } from '../tag-management/remove-tag'
import { createList } from './create-list'

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
    await expandLists(page)

    await createList(page, listName)

    await page.waitForSelector(listSelector, {
      timeout: 20000
    })
  })

  test('User should be able to set touch reminder for a list', async () => {
    await expandLists(page)

    await clickAndWait(page, listSelector)

    const touchReminderInputSelector = getTestSelector('touch-reminder-input')
    const touchFrequency = (Math.floor(Math.random() * 99999) + 1).toString()

    await clickAndType(page, touchReminderInputSelector, touchFrequency)

    await page.click(getTestSelector('touch-reminder-days'))

    page.waitForResponse(() => true)

    expect(await getElProp(page, touchReminderInputSelector, 'value')).toBe(
      touchFrequency
    )
  })

  test('User should be able to delete contacts lists', async () => {
    await expandLists(page)

    await page.waitForSelector(listSelector)
    await page.hover(listSelector)

    const deleteListSelector = `${listSelector} ${getTestSelector(
      'delete-list'
    )}`

    await page.waitForSelector(deleteListSelector)
    await page.click(deleteListSelector)

    const confirmButton = await page.waitForSelector(
      getTestSelector('confirmation-modal-confirm-button')
    )

    await confirmButton.click()
    await page.waitForResponse(
      response =>
        response.status() >= 200 && response.url().includes('contacts/lists/')
    )
  })

  test('Tags are updated after a new tag is added to a contact', async () => {
    // navigate to contacts list page

    const tagName = `test-tag-${Math.floor(Math.random() * 10 ** 6)}`

    // Expand tags to ensure all of them exist in dom
    await expandTags(page)

    await addNewTag(page, tagName)

    // Assert that the new tag exists in tags section in side menu
    await page.waitForSelector(getTestSelector(`tag-item-${tagName}`), {
      timeout: 20000
    })

    // Remove the new tag
    await navigateRelative(page, '/dashboard/account/manage-tags')
    await removeTag(page, tagName)
  })
})
