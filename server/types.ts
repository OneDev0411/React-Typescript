import type { Request } from 'express'

export type RequestWithSession = Request & {
  session: Session
}

export interface Session {
  user: {
    access_token: string
    refresh_token: string
    expire_date: number
  } | null
}
