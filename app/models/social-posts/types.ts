type SocialPostFilterExecuted = 'true' | 'false'

export interface GetSocialPostFilter {
  user?: UUID
  executed?: SocialPostFilterExecuted
  start?: number
  limit?: number
}

export interface UseGetSocialPostsFilter
  extends Omit<GetSocialPostFilter, 'start' | 'limit' | 'executed'> {
  executed: SocialPostFilterExecuted
}
