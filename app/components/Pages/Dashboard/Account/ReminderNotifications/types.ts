export interface ItemState {
  readonly eventType: string
  readonly label: string
  readonly selected: boolean
  readonly reminderSeconds: number
}

export interface ColumnState {
  readonly objectType: string
  readonly title: string
  readonly items: readonly ItemState[]
}
