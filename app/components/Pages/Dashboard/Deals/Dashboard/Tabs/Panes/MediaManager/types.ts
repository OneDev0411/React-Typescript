export interface IMediaItem {
  file: string
  src: string
  name: string
  order: number
  selected?: boolean
  uploadProgress?: number | undefined
  isNew?: boolean
}

export type IMediaGallery = IMediaItem[]

export interface IMediaManagerAPI {
  state: IMediaGallery
  dispatch: React.Dispatch<any>
}
