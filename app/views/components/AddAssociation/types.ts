export interface AddAssociationProps {
  title?: string
  disabled: boolean
  isMultipleSelected?: boolean
  handleAdd: (value: object, callback?: () => void) => void
}
