declare interface ICRMTaskReminder {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at?: Nullable<number>
  is_relative: boolean
  timestamp: number
  task: UUID
  type: 'reminder'
}
