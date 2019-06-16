import { Page } from 'puppeteer'

import { getTestSelector } from '../../helpers'
import { submitDrawerForm } from '../../helpers/drawer-helpers'
import { clickAndType } from '../../helpers/page'

interface ContactData {
  title?: string
  firstName?: string
  lastName?: string
  // We can add items to this list whenever it's required
}

export async function createContact(
  contactsPage: Page,
  { title, firstName, lastName }: ContactData = {}
) {
  const addButton = (await contactsPage.$(
    getTestSelector('create-contact-button')
  ))!

  await addButton.click()

  const titleSelect = await contactsPage.waitForSelector(
    getTestSelector('title-select')
  )

  await titleSelect.click()

  const titleValueSelector = getTestSelector(
    `title-select-option-${title || 'Mr.'}`
  )

  const titleOption = await contactsPage.waitForSelector(titleValueSelector)

  await titleOption.click()

  await fillContactField('first_name', firstName)
  await fillContactField('last_name', lastName)

  await submitDrawerForm(contactsPage)

  function fillContactField(fieldName: string, value) {
    if (value) {
      return clickAndType(
        contactsPage,
        getTestSelector(`text-field-${fieldName}`),
        value
      )
    }
  }
}
