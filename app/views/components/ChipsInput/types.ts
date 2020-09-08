import { ReactNode } from 'react'
import { ChipProps } from '@material-ui/core/Chip'
import { TextFieldProps } from '@material-ui/core/TextField'
import { Observable } from 'rxjs'
import { TextField } from '@material-ui/core'
import { TextField as FinalFormTextField } from 'final-form-material-ui'

import { Props as AvatarProps } from 'components/GeneralAvatar/type'

/**
 * Used in {@link ChipsInputProps#itemToChip}. See description there.
 */
export interface ChipInputItem {
  label: ReactNode
  hasError?: boolean
  avatar?: ReactNode
  tooltip?: ReactNode
}

export interface Suggestion {
  title: ReactNode
  subtitle?: ReactNode
  group?: string

  /**
   * The rechat avatar component props
   */
  defaultAvatarProps?: AvatarProps

  /**
   * A custom avatar component
   */
  avatar?: ReactNode
}

export interface ChipsInputProps<T> {
  /**
   * The list of chip items to be shown before the input
   */
  items: T[]

  /**
   * Called when either remove button on the chip is clicked or it's removed
   * by pressing backspace in the input
   * @param chip
   */
  onChange?: (items: T[]) => void

  /**
   * Right now, we have parameterized the UI for each item, and we render
   * {@link Chip MUI Chip} component for each item. This now addresses our
   * current requirements, but we may end up changing this approach and
   * accepting a renderItem prop instead of itemToChip prop that maps each
   * to a data structure suitable with this abstraction.
   * This `renderItem` is for sure more general and flexible but it maybe
   * overkill if current abstraction is enough.
   */
  itemToChip: (item: T) => ChipInputItem

  itemToSuggestion: (item: T) => Suggestion | undefined

  /**
   * Called when user has entered some text and hits enter
   * and allowAddOnEnter is true
   * @param inputValue
   */
  createFromString?: (inputValue: any) => T | undefined

  allowAddOnEnter?: boolean

  allowAddOnBlur?: boolean

  allowAddOnComma?: boolean

  readOnly?: boolean

  searchDebounce?: number

  /**
   * component to be used for autocompletion
   * @param searchTerm
   */
  getSuggestions?: (searchTerm: string) => Observable<T[]>

  /**
   * Props to be passed to all chips, excluding the following props which are
   * overridden:
   * - {@link ChipProps#label label}
   * - {@link ChipProps#color color}
   */
  ChipProps?: Omit<ChipProps, 'label' | 'onDelete'>
  /**
   * Props to be passed to the underlying TextField component. The following
   * props are passed to the TextField if not individually overridden by
   * `textFieldProps`:
   * {
   *   fullWidth: true
   * }
   *
   * The following props are controlled and may not be overridden:
   * - {@link TextFieldProps#startAdornment startAdornment}
   */
  TextFieldProps?: TextFieldProps | any // TODO update type to take out excluded props

  TextFieldComponent?: typeof TextField | typeof FinalFormTextField
}
