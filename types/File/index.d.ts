declare interface IFile extends IModel<'file'> {
  created_by: UUID
  mime: string
  name: string
  path: string
  preview_url: string
  public: boolean
  url: string
}

declare interface IDealFile extends IFile {
  task: UUID | null
  checklist: UUID | null
  source: 'submission' | 'attachment' | 'envelope' | 'stash'
  internal_url?: string
}

declare interface IDealEmailFile {
  id: UUID | null
  name: string
  url: string
}
