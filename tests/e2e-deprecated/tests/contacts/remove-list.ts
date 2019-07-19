import { Page } from 'puppeteer'

import { expandShowMoreLess } from './expand-show-more-less'
import { acceptConfirmationModal, waitForRemove } from '../../helpers/page'
import { getTestSelector } from '../../helpers'

export async function removeList(contactsPage: Page, listName) {
  const listSelector = getTestSelector(`contact-list-${listName}`)

  await expandShowMoreLess(contactsPage, getTestSelector('lists-list'))

  await contactsPage.waitForSelector(listSelector)
  await contactsPage.hover(listSelector)

  const deleteListSelector = `${listSelector} ${getTestSelector('delete-list')}`

  await contactsPage.waitForSelector(deleteListSelector)
  await contactsPage.click(deleteListSelector)

  await acceptConfirmationModal(contactsPage)

  await waitForRemove(contactsPage, listSelector)
}
