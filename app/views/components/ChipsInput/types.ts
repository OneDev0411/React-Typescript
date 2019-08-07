import { ReactNode } from 'react'
import { ChipProps } from '@material-ui/core/Chip'
import { TextFieldProps } from '@material-ui/core/TextField'
import { Observable } from 'rxjs'

export interface ChipInputItem {
  label: ReactNode | string
  hasError?: boolean
  avatar?: ReactNode | string
}
export interface Suggestion<T = any> {
  title: ReactNode
  subtitle?: ReactNode
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

  itemToChip: (item: T) => ChipInputItem

  itemToSuggestion: (item: T) => Suggestion

  /**
   * Called when user has entered some text and hits enter
   * and allowAddOnEnter is true
   * @param inputValue
   */
  createFromString?: (inputValue: any) => T | undefined

  allowAddOnEnter?: boolean

  allowAddOnBlur?: boolean

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
  ChipProps?: Omit<ChipProps, 'label' | 'color' | 'onDelete'>
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
  TextFieldProps?: TextFieldProps // TODO update type to take out excluded props

  /**
   * Label to be used **before** the input. If you want normal TextField labels
   * provide it in {@link ChipsInputProps#TextFieldProps}.
   */
  label?: string
}
