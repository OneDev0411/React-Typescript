import { resolve } from 'path'
import { init } from '../helpers'
import { clearAndType, clickAndWait, getElProp, skipPhoneNagScreen } from '../helpers/page'
import { signIn } from '../helpers/auth'

describe('Profile Settings', () => {
  let browser
  let page

  beforeAll(async () => {
    const instances = await init()

    browser = instances.browser
    page = instances.page
    await signIn(page)
  })

  afterAll(async () => {
    await browser.close()
  })

  beforeEach(async () => {
    await skipPhoneNagScreen(page)
  })

  it('User is able to open settings page', async () => {
    await page.click('[data-test="settings-dropdown-button"]')
    await clickAndWait(page, '[href="/dashboard/account"]')
    await page.waitForSelector('.c-account__form')
  })

  it('User is able to delete avatar', async () => {
    await page.click('[data-test="profile-avatar-delete-button"]')
    await page.click('[data-test="confirmation-modal-confirm-button"]')
    await page.waitFor('[data-test="profile-avatar-delete-button"]', {hidden: true})
  })

  it('User is able to upload avatar', async () => {
    await page.click('[data-test="profile-avatar-upload-button"]')
    const input = await page.$('[data-test="image-uploader-modal-dropzone"] input[type="file"]')
    await input.uploadFile(resolve('../data/avatar.jpg'))
    await page.click('[data-test="image-uploader-modal-save-button"]')
    await page.waitForSelector('[data-test="profile-avatar-delete-button"]')
    await page.waitForSelector('[data-test="profile-avatar-image"]')
  })

  it('User is able to update personal info', async () => {
    const first_name = 'Emil_' + new Date().getTime()
    const last_name = 'Agent_' + new Date().getTime()

    await clearAndType(page, '#first_name', first_name)
    await clearAndType(page, '#last_name', last_name)
    await page.click('[data-test="personal-info-form-submit-button"]')
    await page.waitFor('[data-test="personal-info-form-submit-button"][disabled=""]', {hidden: true})
    await skipPhoneNagScreen(page)
    await page.waitForSelector('.c-account__form')

    expect(await getElProp(page, '#first_name', 'value')).toBe(first_name)
    expect(await getElProp(page, '#last_name', 'value')).toBe(last_name)
  })

  it('User is able to update time zone', async () => {
    await page.click('[name="time_zone"]')
    const value = (await getElProp(page, '[data-test="timezone-dropdown"] input', 'value')) === 'UTC' ? 'GMT' : 'UTC'
    await clearAndType(page, '[data-test="timezone-dropdown"] input', value)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await page.click('[data-test="timezone-form-submit-button"]')
    await page.waitFor('[data-test="timezone-form-submit-button"][disabled=""]', {hidden: true})
    await skipPhoneNagScreen(page)
    await page.waitForSelector('.c-account__form')

    expect(await getElProp(page, '[name="time_zone"]', 'textContent')).toBe(value)
  })

  /* TODO: cover upload doesn't trigger an onchange event for some reason.
  Need to find out what's in puppeteer. After that this section can be uncommented.
  
  it('User is able to upload cover', async () => {
    const input = await page.$('.c-cover-image input[type="file"]')
    await input.uploadFile(resolve('../data/avatar.jpg'))
    await page.waitForSelector('.c-cover-image__img')
  })

  it('User is able to delete cover', async () => {
    await page.click('[data-test="cover-image-form-delete-button"]')
    await page.waitFor('[data-test="cover-image-form-delete-button"]', {hidden: true})
    await page.waitForSelector('.c-cover-image__placeholder')
  }) */
})
