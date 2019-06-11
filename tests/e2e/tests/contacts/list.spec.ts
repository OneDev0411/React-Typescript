import { Browser, Page } from 'puppeteer'

import { init } from '../../helpers'
import { navigateRelative } from '../../helpers/page'
import { signIn } from '../../helpers/auth'
import { expandTags } from './expand-tags'
import { addNewTag } from './add-new-tag'
import { removeTag } from '../tag-management/remove-tag'

describe('Contacts list page', () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    const instances = await init()

    browser = instances.browser
    page = instances.page
    await signIn(page, undefined, false)

    await navigateRelative(page, '/dashboard/contacts')
  })

  afterAll(async () => {
    await browser.close()
  })

  test('Tags are updated after a new tag is added to a contact', async () => {
    // navigate to contacts list page

    const tagName = `test-tag-${Math.floor(Math.random() * 10 ** 6)}`

    // Expand tags to ensure all of them exist in dom
    await expandTags(page)

    await addNewTag(page, tagName)

    // Assert that the new tag exists in tags section in side menu
    await page.waitForFunction(
      // Another solution for finding the new tag would be to set a unique
      // data-test attribute for each tag (like tag-item-[tagName]), and
      // directly query it.
      `[...document.querySelectorAll('[data-test="tag-item"]')].find(
          tag => tag.textContent === '${tagName}'
        )`,
      { timeout: 20000 }
    )

    // Remove the new tag
    await navigateRelative(page, '/dashboard/account/manage-tags')
    await removeTag(page, tagName)
  })
})
