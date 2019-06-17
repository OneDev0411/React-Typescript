import { Page, JSHandle } from 'puppeteer'

import { getTestSelector } from '.'

export const clickAndWait = async (
  page: Page,
  selector: string,
  fullWait = true
) => {
  const navigation = page.waitForNavigation({
    waitUntil: fullWait ? 'networkidle0' : 'networkidle2'
  })

  await page.waitForSelector(selector)
  await page.click(selector)
  await navigation
}

export const clickAndType = async (
  page: Page,
  selector: string,
  value: string
) => {
  await page.click(selector)
  await page.type(selector, value)
}

export const clearAndType = async (
  page: Page,
  selector: string,
  value: string
) => {
  await page.click(selector, { clickCount: 3 })
  await page.type(selector, value)
}

export const getElProp = async (
  page: Page,
  selector: string,
  prop: string
): Promise<JSHandle | null> => {
  const element = await page.$(selector)

  if (!element) {
    return null
  }

  const handle = await element.getProperty(prop)

  return handle.jsonValue()
}

export const skipPhoneNagScreen = async (page: Page) => {
  try {
    await page.waitForSelector('.c-verify-phone-modal', { timeout: 5000 })
    await page.keyboard.press('Escape')
  } catch (e) {
    // All is good, nothing to handle.
  }
}

export const waitForRemove = async (
  page: Page,
  selector: string,
  timeout: number = 5000,
  interval: number = 500
) => {
  let remainingTimeout = timeout

  while (remainingTimeout >= 0) {
    const elementHandler = await page.$(selector) // eslint-disable-line

    if (elementHandler === null) {
      return
    }

    remainingTimeout -= interval
    await page.waitFor(interval) // eslint-disable-line
  }

  throw new Error()
}

export const navigateRelative = (
  page: Page,
  relativeUrl: string,
  fullWait = true
) => {
  return page.goto(
    // @ts-ignore
    `${global.host}${relativeUrl}`
      // Remove possible extra slashes
      .split('/')
      .filter(i => i)
      .join('/'),
    { waitUntil: fullWait ? 'networkidle0' : 'networkidle2', timeout: 40000 }
  )
}

export const acceptConfirmationModal = async (page: Page) => {
  const confirmButton = await page.waitForSelector(
    getTestSelector('confirmation-modal-confirm-button')
  )

  await confirmButton.click()
}

export const cancelConfirmationModal = async (page: Page) => {
  const cancelButton = await page.waitForSelector(
    getTestSelector('confirmation-modal-cancel-button')
  )

  await cancelButton.click()
}

export const waitForModalToClose = (page: Page) => {
  return waitForRemove(page, '.ReactModal__Overlay')
}

export const waitForDrawerToClose = (page: Page) => {
  return waitForRemove(page, getTestSelector('open-overlay'))
}

export const waitForResponseInRange = (
  page: Page,
  minStatusCode: number,
  maxStatusCode: number
) => {
  return page.waitForResponse(response => {
    const statusCode = response.status()

    return statusCode >= minStatusCode && statusCode <= maxStatusCode
  })
}

export const waitForResponseWithCode = (page: Page, code: number) => {
  return waitForResponseInRange(page, code, code)
}

export const waitFor2xxResponse = (page: Page) => {
  return waitForResponseInRange(page, 200, 299)
}

export const waitFor4xxResponse = (page: Page) => {
  return waitForResponseInRange(page, 400, 499)
}
