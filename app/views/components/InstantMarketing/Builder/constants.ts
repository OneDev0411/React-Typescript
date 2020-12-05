import { mdiFacebook, mdiInstagram, mdiLinkedin } from '@mdi/js'

import { SocialNetworkShare } from './types'

export const SOCIAL_NETWORKS: SocialNetworkShare[] = [
  {
    name: 'Instagram',
    icon: mdiInstagram
  },
  {
    name: 'Facebook',
    icon: mdiFacebook
  },
  {
    name: 'LinkedIn',
    icon: mdiLinkedin
  }
]

export const BASICS_BLOCK_CATEGORY = 'Basics'
export const LISTINGS_BLOCK_CATEGORY = 'Listings'
export const ARTICLES_BLOCK_CATEGORY = 'Articles'
export const AGENTS_BLOCK_CATEGORY = 'Agents'
export const MARKET_REPORTS_CATEGORY = 'Market Reports'
