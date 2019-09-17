declare type IDealTaskType = 'Form' | 'GeneralComments' | 'Generic'

declare interface IDealTaskRoom {
  attachments: IFile[]
  created_at: number
  deleted_at: number | null
  id: UUID
  latest_message: IChatMessage
  latest_activity: IChatActivity
  new_notifications: number
  notification_settings: any
  owner: null
  proposed_title: string
  room_type: string
  title: string
  type: 'room'
  updated_at: number | null
  users: IUser[]
}

declare interface IDealTaskSubmission {
  author: UUID
  created_at: number
  file: IFile
  form: UUID
  formstack_id: number | null // deprecated
  id: UUID
  last_revision: UUID
  revision_count: number
  state: string
  title: string
  type: 'form_submission'
  updated_at: number
}

declare interface IDealTask {
  attention_requested: boolean
  attention_requested_at: string | null
  checklist: UUID
  created_at: string
  deal: UUID
  deleted_at: string | null
  form: UUID
  id: UUID
  is_deletable: boolean
  pdf_url: string
  required: boolean
  task_type: IDealTaskType
  title: string
  type: 'task'
  updated_at: string
  submission: IDealTaskSubmission | null
  room: IDealTaskRoom
  review: null | {
    id: UUID
    created_at: number
    type: 'review'
    status: string
    updated_at: number
  }
}

declare type IDealTaskInput = Partial<Omit<IDealTask, 'id' | 'checklist'>> &
  Pick<IDealTask, 'task_type'>
