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
  tinygif: Item
  gif: Item
  mp4: Item
}

interface Item {
  url: string
  dims: number[]
  preview: string
  size: number
  duration?: number
}
