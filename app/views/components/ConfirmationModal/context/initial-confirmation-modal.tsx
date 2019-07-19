export const initialConfirmationModal = {
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

  // Cancel Button
  onCancel: null,
  cancelLabel: '',
  needsCancel: true,

  // Confirm Button
  onConfirm: null,
  confirmLabel: '',
  needsConfirm: true,

  // Methods
  setConfirmationModal: (config: typeof initialConfirmationModal) => {}
}
