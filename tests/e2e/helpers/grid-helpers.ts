import { Page } from 'puppeteer'

import { getElementText, getTestSelector } from './index'

export const selectGridRow = async (page: Page, index: number = 0) => {
  const firstItemCheckbox = await page.waitForSelector(
    [getGridRowSelector(page, index), getTestSelector('checkbox')].join(' ')
  )

  if (!firstItemCheckbox) {
    throw new Error(`Could not found row ${index} or it's not selectable`)
  }

  await firstItemCheckbox.click()
}

export const getSelectionCount = async (page: Page) => {
  const summary = await page.waitForSelector(getTestSelector('table-summary'))
  const numbers = (await getElementText(summary)).match(/([0-9]+)/g)

  return Array.isArray(numbers) && numbers.length === 2
    ? parseInt(numbers[0], 10)
    : 0
}

export const getRowId = async (page: Page, index = 0) => {
  const row = await page.$(getGridRowSelector(page, index))

  if (!row) {
    throw new Error(`Could not found row ${index}`)
  }

  return (await row.getProperty('id')).jsonValue()
}

export const getGridRowSelector = (page: Page, index: number) =>
  `${getTestSelector('grid-row')}:nth-child(${index + 1})`
