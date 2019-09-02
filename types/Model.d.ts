declare interface IModel<T extends string> {
  type: T
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: number | null
}
