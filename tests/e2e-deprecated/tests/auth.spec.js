import { init } from '../helpers'
import { signIn, signOut } from '../helpers/auth'

describe('Authentication', () => {
  let browser
  let page

  beforeAll(async () => {
    const instances = await init()

    browser = instances.browser
    page = instances.page
  })

  afterAll(async () => {
    await browser.close()
  })

  it('User is able to sign in', async () => {
    await signIn(page)
  })

  it('User is able to sign out', async () => {
    await signOut(page)
  })
})
