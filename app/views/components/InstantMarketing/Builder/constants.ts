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

export const TOOLBAR_BUTTONS_PREFIX = 'rechat'

export const IMAGE_TOOLBAR_BUTTONS_PREFIX = 'rechat-image'
export const EDIT_IMAGE_TOOLBAR_BUTTON_NAME = `${IMAGE_TOOLBAR_BUTTONS_PREFIX}-edit`
export const CHANGE_IMAGE_TOOLBAR_BUTTON_NAME = `${IMAGE_TOOLBAR_BUTTONS_PREFIX}-change`

export const IMAGE_ELEMENT_TYPES: string[] = [
  'image',
  'mj-image',
  'mj-carousel-image',
  'carousel-slide'
]

export const BACKGROUND_IMAGE_ALLOWED_ELEMENT_TYPES: string[] = [
  'cell',
  'text',
  'div'
]

export const BACKGROUND_URL_ALLOWED_ELEMENT_TYPES: string[] = ['mj-hero']

export const MAP_TOOLBAR_BUTTONS_PREFIX = `${TOOLBAR_BUTTONS_PREFIX}-map`
export const CHANGE_MAP_THEME_TOOLBAR_BUTTONS_PREFIX = `${MAP_TOOLBAR_BUTTONS_PREFIX}-change-theme`
