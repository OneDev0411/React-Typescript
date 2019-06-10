import { clickAndWait } from './page'

export const signIn = async (
  page,
  { email = global.email, password = global.password } = {},
  fullWait = true
) => {
  await clickAndWait(page, '[href="/signin"]')
  await page.type('#username', email)
  await page.type('#password', password)
  await clickAndWait(page, '[type="submit"]', fullWait)
}

export const signOut = async page => {
  await page.click('.c-app-sidenav__account-dropdown button')
  await clickAndWait(page, '[href="/signout"]')
}
