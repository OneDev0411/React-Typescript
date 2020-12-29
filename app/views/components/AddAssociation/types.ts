export interface AddAssociationProps {
  title?: string
  disabled: boolean
  isMultipleSelected?: boolean
  showTitle?: boolean
  isPrimary?: boolean
  handleAdd: (value: object, callback?: () => void) => void
}
