declare type TUserFilter = UUID[]

declare interface Window {
  FS: Fullstory
  Appcues: Appcues
  INTERCOM_ID: string
  AppcuesReady: (callback: any) => void
}
