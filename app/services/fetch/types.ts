type Progress = () => void

export interface IOptions {
  proxy?: boolean
  useReferencedFormat?: boolean
  progress?: null | Progress
}

export interface IMiddleware {
  [name: string]: any
}
