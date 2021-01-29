export interface ConfirmationModalConfig {
  isShow?: boolean
  appearance?: 'normal' | 'danger'

  // Default Interface
  message: string
  description?: string

  // User Entry
  multilineEntry?: boolean
  needsUserEntry?: boolean
  inputDefaultValue?: string
  inputPlaceholder?: string
  inputStyle?: React.CSSProperties

  // Cancel Button
  onCancel?: null | (() => any)
  cancelLabel?: string
  needsCancel?: boolean

  // Confirm Button
  onConfirm?: null | ((userInput?: string) => void)
  confirmLabel?: string
  needsConfirm?: boolean
}
export const initialConfirmationModal: ConfirmationModalConfig & {
  setConfirmationModal: (config: ConfirmationModalConfig) => any
} = {
  // Visibility
  isShow: false,
  appearance: 'normal', // normal, danger

  // Default Interface
  message: '',
  description: '',

  // User Entry
  multilineEntry: true,
  needsUserEntry: false,
  inputDefaultValue: '',
  inputPlaceholder: '',
  inputStyle: {},

  // Cancel Button
  onCancel: null,
  cancelLabel: '',
  needsCancel: true,

  // Confirm Button
  onConfirm: null,
  confirmLabel: '',
  needsConfirm: true,

  // Methods
  setConfirmationModal: (config: ConfirmationModalConfig) => {}
}
