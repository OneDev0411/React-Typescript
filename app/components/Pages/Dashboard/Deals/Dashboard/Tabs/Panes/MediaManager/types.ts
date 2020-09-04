export interface IMediaItem {
  id: UUID
  src: string
  name: string
  order: number
  selected?: boolean
  uploadProgress?: number | undefined
  isUploading?: boolean
}

export type IMediaGallery = IMediaItem[]

export interface IMediaManagerContext {
  state: IMediaGallery
  dispatch: React.Dispatch<any>
}
