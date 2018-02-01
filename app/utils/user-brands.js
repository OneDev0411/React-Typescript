import cookie from 'js-cookie'

const ACTIVE_BRAND_COOKIE = 'rechat-active-brand'

export function getActiveBrand(user) {
  const { brands } = user

  if (!brands || !user.brand) {
    return []
  }

  const brand = brands.find(account => account.brand.id === getActivatedBrandId(user))

  return brand ? brand.acl : []
}

export function hasUserAccess(user, action) {
  return getActiveBrand(user).includes(action)
}

export function getActivatedBrandId(user) {
  return cookie.get(ACTIVE_BRAND_COOKIE) || user.brand
}

export function changeActiveBrand(brandId) {
  cookie.set(ACTIVE_BRAND_COOKIE, brandId, {
    path: '/',
    expires: 360
  })
}
