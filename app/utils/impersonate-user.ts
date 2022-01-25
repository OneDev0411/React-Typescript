import Cookies from 'universal-cookie'

import { BrandedUser } from '@app/views/components/TeamAgents/types'

const cookies = new Cookies()
const IMPERSOATE_USER_COOKIE_KEY = 'impersonate_user'

export const setImpersonateUser = (user: BrandedUser): void => {
  const stringifiedUserr = JSON.stringify(user)

  cookies.set(IMPERSOATE_USER_COOKIE_KEY, stringifiedUserr, {
    path: '/',
    maxAge: 7 * 86400 // max would be 7 days
  })
}

export const getImpersonateUser = (): Nullable<BrandedUser> => {
  const user = cookies.get(
    IMPERSOATE_USER_COOKIE_KEY
  ) as unknown as Optional<BrandedUser>

  return user ?? null
}

export const removeImpersonateUser = (): void => {
  cookies.remove(IMPERSOATE_USER_COOKIE_KEY)
}
