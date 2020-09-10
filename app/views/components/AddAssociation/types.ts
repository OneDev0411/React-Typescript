export interface AddAssociationProps {
  title?: string
  disabled: boolean
  multipleSelection?: boolean
  handleAdd: (value: object, callback?: () => void) => void
}
