import { Browser, Page } from 'puppeteer'

import { createContact } from './create-contact'
import { signIn } from '../../helpers/auth'
import { navigateRelative } from '../../helpers/page'
import { init } from '../../helpers'
import { getSelectionCount, selectGridRow } from '../../helpers/grid-helpers'
import { deleteContact } from './delete-contacts'

describe('contacts page', () => {
  let browser: Browser
  let page: Page

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

  test('User can create contact', async () => {
    await createContact(page, { firstName: 'Paul', lastName: 'Scholes' })
  })

  test('User can remove a selected contact and selection should correctly get updated', async () => {
    expect(await getSelectionCount(page)).toBe(0)
    await selectGridRow(page)
    expect(await getSelectionCount(page)).toBe(1)

    await deleteContact(page)
    expect(await getSelectionCount(page)).toBe(0)
  })
})
