export interface Image {
  id: string
  url: string
  thumbnail?: string
}

export interface Pagination {
  page?: number
  perPage?: number
}

export interface MinimalApiImageItem {
  id: string
  urls: {
    full: string
    raw: string
    regular: string
    small: string
    thumb: string
  }
}
