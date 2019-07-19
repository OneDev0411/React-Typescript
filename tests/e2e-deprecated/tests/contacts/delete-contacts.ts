import { Page } from 'puppeteer'

import { getGridRowSelector, getRowId } from '../../helpers/grid-helpers'
import { getTestSelector } from '../../helpers'
import { acceptConfirmationModal, waitForRemove } from '../../helpers/page'

export const deleteContact = async (page: Page, index = 0) => {
  const rowId = await getRowId(page, index)

  const menuTrigger = await page.waitForSelector(
    [getGridRowSelector(page, index), getTestSelector('contact-menu')].join(' ')
  )

  await menuTrigger.click()

  const action = await page.waitForSelector(
    getTestSelector('contact-row-delete-action')
  )

  await action.click()

  await acceptConfirmationModal(page)
  await waitForRemove(page, `#${rowId}`)
}
