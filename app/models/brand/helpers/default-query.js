export const BRAND_USERS_QUERY = {
  'associations[]': ['brand.roles', 'brand_role.users']
}

const DEFAULT_QUERY = BRAND_USERS_QUERY

export default DEFAULT_QUERY
