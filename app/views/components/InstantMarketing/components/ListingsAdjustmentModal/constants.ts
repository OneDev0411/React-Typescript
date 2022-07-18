import { IAdjustment } from './types'

export const OVER_LAYER_HEIGHT = 100
export const PLACEHOLDER_IMAGE = '/static/images/logo--gray.svg'
export const EMPTY_ADJUSTMENT: OptionalBy<IAdjustment, 'value'> = {
  description: '',
  value: undefined
}
export const INITIAL_ADJUSTMENT_SIZE = 6
export const MIN_ADJUSTMENT_SIZE = 1
export const MAX_ADJUSTMENT_SIZE = 10
