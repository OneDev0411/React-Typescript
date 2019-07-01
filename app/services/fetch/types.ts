type Progress = () => void

export interface IOptions {
  proxy: boolean
  compressResponse: boolean
  progress: null | Progress
}

export interface IMiddleware {
  [name: string]: any
}
