import { IAdjustment } from './types'

export const OVER_LAYER_HEIGHT = 100
export const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'
export const EMPTY_ADJUSTMENT: OptionalBy<IAdjustment, 'value'> = {
  description: '',
  value: undefined
}
export const LG_MAX_SLIDER_ITEMS_COUNT = 3
export const XL_MAX_SLIDER_ITEMS_COUNT = 4
export const INITIAL_ADJUSTMENT_SIZE = 6
export const MIN_ADJUSTMENT_SIZE = 1
export const MAX_ADJUSTMENT_SIZE = 10
