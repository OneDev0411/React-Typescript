import { AxiosError } from 'axios'

import { URL_PATTERN } from '../../constants'

export function getErrorRedirectUrl(e: AxiosError<string>): string | null {
  if (
    e.response?.status === 302 &&
    e.response.data &&
    e.response.data.match(URL_PATTERN)
  ) {
    const linkMatch = e.response.data.match(URL_PATTERN)

    if (linkMatch) {
      const link = linkMatch.map((url: string) => url.trim())

      return link[0]
    }
  }

  return null
}
