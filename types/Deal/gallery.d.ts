declare interface IMediaItem {
  id: UUID
  src: string
  name: string
  order: number
  selected?: boolean
  uploadProgress?: number | undefined
  isUploading?: boolean
}

declare type IMediaGallery = IMediaItem[]

declare interface IMediaManagerContext {
  state: IMediaGallery
  dispatch: React.Dispatch<any>
}
