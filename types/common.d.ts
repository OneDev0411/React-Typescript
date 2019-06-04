declare type UUID = string
declare type Callback<R> = (err?: any, res?: R) => void
declare interface IModelAssociation {
  collection?: boolean
  enabled?: boolean
  optional?: boolean
  model: string
}

declare interface StringMap<T> {
  [key: string]: T
}

declare type Omit<T, K extends keyof any> = T extends any
  ? Pick<T, Exclude<keyof T, K>>
  : never

declare type Overwrite<T, U> = Omit<T, keyof U> & U

declare interface PaginationOptions {
  start?: number
  limit?: number
  order?: string
}

declare interface IIdCollectionResponse {
  total: number
  ids: UUID[]
}

declare type RequireProp<T, K extends keyof T> = { [P in K]-?: T[P] } & T
declare type TIsPropertyPresent<T, P extends T, K extends keyof P> = (
  x: T
) => x is P
declare type TIsRequirePropPresent<T, K extends keyof T> = TIsPropertyPresent<
  T,
  T & RequireProp<T, K>,
  K
>

declare type TCallback<T> = ((err: any) => void) | ((err: null, res: T) => void)

declare interface ApiResponse<T> {
  data: T
  info: {
    // TODO: info not always existing
    count: number
    total: number
  }
}

declare type ApiPromise<T> = Promise<ApiResponse<T>>

declare type PartiallyMappedFields<T, K extends keyof T, MappedType> = {
  [key in keyof T]: key extends K ? MappedType : T[key]
}

declare type MapFieldsToUuid<T, K extends keyof T> = PartiallyMappedFields<
  T,
  K,
  UUID
>
