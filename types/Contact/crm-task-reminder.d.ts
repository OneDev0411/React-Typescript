declare interface ICRMTaskReminder {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at?: number | null
  is_relative: boolean
  timestamp: number
  task: UUID
  type: 'reminder'
}
