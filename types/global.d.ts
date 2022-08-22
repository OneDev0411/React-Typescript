declare type TUserFilter = UUID[]

declare interface Window {
  FS: Fullstory
  Appcues: Appcues
  INTERCOM_ID: string
  socket: SocketIOClient.Socket
  libs?: Record<string, any> // libs is used to inject libraries into the Apps SDK
  AppcuesReady: (callback: any) => void
}
