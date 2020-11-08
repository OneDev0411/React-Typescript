export interface Session {
  user: {
    access_token: string
    refresh_token: string
    expire_date: number
  }
}
