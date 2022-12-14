import { AxiosError } from 'axios'
import type { Request, Response } from 'express'

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

export type RequestError = AxiosError<{
  pipe: (res: Response<any, Record<string, any>>) => void
}>
