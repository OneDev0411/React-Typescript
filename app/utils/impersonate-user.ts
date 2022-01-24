import Cookies from 'universal-cookie'

import { BrandedUser } from '@app/views/components/TeamAgents/types'

const cookies = new Cookies()
const IMPERSOATE_USER_COOKIE_KEY = 'impersonate_user'

export const setImpersonateUser = (user: BrandedUser): void => {
  const stringifiedUserr = JSON.stringify(user)

  cookies.set(IMPERSOATE_USER_COOKIE_KEY, stringifiedUserr, {
    path: '/'
  })
}

export const getImpersonateUser = (): Nullable<BrandedUser> => {
  const user = JSON.parse(cookies.get(IMPERSOATE_USER_COOKIE_KEY))

  return user ?? null
}
