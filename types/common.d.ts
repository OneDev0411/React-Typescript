declare type UUID = string
declare type Callback<R> = (err?: any, res?: R) => void
declare interface IModelAssociation {
  collection?: boolean
  enabled?: boolean
  optional?: boolean
  model: string
}

declare type Nullable<T> = T | null

declare type Optional<T> = T | undefined

declare type OptionalNullable<T> = Optional<T> | Nullable<T>

declare interface StringMap<T> {
  [key: string]: T
}

declare interface UuidMap<T> {
  [key: UUID]: T
}

declare type EnumMap<K, T> = { [key in K]: T }

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

interface ILabelValue {
  label: string
  value: string
}

declare interface ApiResponseBody<T> {
  data: T
  references: T
  code: string
  info?:
    | boolean
    | {
        count: number
        total: number
      }
}

declare interface ApiResponse<T> {
  body: ApiResponseBody<T>
  status: number
  statusCode: number
  statusText: number
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

type IAsyncActionProp<
  T extends (...args: any[]) => (dispatch, getState) => any
> = (...args: Parameters<T>) => ReturnType<ReturnType<T>>

declare type Association<
  Field,
  Value,
  Associations,
  Association = Field
> = Association extends Associations
  ? { [key in Field]: Value }
  : Record<never, never>
