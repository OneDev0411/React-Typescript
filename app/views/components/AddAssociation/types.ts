export type HandleAdd = (value: object, callback: () => void) => void

export interface AddAssociationProps {
  title?: string
  disabled: boolean
  handleAdd: HandleAdd
}
