declare type TUserFilter = UUID[]

declare interface Window {
  FS: Fullstory
  Appcues: Appcues
  INTERCOM_ID: string
  socket: SocketIOClient.Socket
  AppcuesReady: (callback: any) => void
}
