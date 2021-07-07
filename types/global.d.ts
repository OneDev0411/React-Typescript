declare type TUserFilter = UUID[]

declare interface Window {
  FS: Fullstory
  Appcues: Appcues
  INTERCOM_ID: string
  AppcuesReady: (callback: any) => void
}

declare type Timeout = ReturnType<typeof setTimeout>
declare type Interval = ReturnType<typeof setInterval>
