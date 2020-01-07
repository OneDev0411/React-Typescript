export interface IMediaItem {
  id: string
  src: string
  selected: boolean
}

export interface IMediaManagerAPI {
  toggleMediaSelection(id: string): void
  toggleGallerySelection(state: boolean): void
  getSelectedItems(): IMediaItem[]
  logId(id: string): void
}
