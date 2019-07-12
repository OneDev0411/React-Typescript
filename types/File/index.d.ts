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

declare interface IUrlFileInput {
  // Emil said it's like this. It's not tested yet.
  url: string
}
