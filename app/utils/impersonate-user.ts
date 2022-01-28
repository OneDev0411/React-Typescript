import { BrandedUser } from '@app/views/components/TeamAgents/types'

const IMPERSOATE_USER_COOKIE_KEY = 'impersonate_user'

export const setImpersonateUser = (user: BrandedUser): void => {
  const stringifiedUser = JSON.stringify(user)

  localStorage.setItem(IMPERSOATE_USER_COOKIE_KEY, stringifiedUser)
}

export const getImpersonateUser = (): Nullable<BrandedUser> => {
  const stringifiedUser = localStorage.getItem(IMPERSOATE_USER_COOKIE_KEY)

  if (!stringifiedUser) {
    return null
  }

  const user: BrandedUser = JSON.parse(stringifiedUser)

  return user ?? null
}

export const removeImpersonateUser = (): void => {
  localStorage.removeItem(IMPERSOATE_USER_COOKIE_KEY)
}
