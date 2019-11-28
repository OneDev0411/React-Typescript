export interface TenorResponse {
  results: GifObject[]
  next: string
}

export interface GifObject {
  tags: any[]
  url: string
  media: Media[]
  created: number
  shares: number
  itemurl: string
  composite: null
  hasaudio: boolean
  title: string
  id: string
}

interface Media {
  tinygif: GifItem
  gif: GifItem
  mp4: GifItem
}

export interface GifItem {
  url: string
  dims: [number, number]
  preview: string
  size: number
  duration?: number
}
