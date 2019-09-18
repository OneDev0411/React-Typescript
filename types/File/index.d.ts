declare interface IFile {
  created_at: number
  created_by: UUID
  deleted_at: null | number
  id: UUID
  mime: string
  name: string
  path: string
  preview_url: string
  public: boolean
  type: 'file'
  updated_at: number
  url: string
}

declare interface IDealFile extends IFile {
  task: UUID | null
  checklist: UUID | null
  source: 'submission' | 'attachment' | 'envelope' | 'stash'
  internal_url?: string
}
