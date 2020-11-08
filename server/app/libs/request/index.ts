import axios, { AxiosRequestConfig } from 'axios'
import curlirize from 'axios-curlirize'

import config from '../../../../config/public'

export function request(requestConfig: AxiosRequestConfig) {
  curlirize(axios)

  return axios({
    ...requestConfig,
    url: `${config.api_url}${requestConfig.url}`
  })

  // request.catch((e: AxiosError) => {
  //   res.status(e.response?.status || 500)

  //   if (requestConfig.responseType === 'stream') {
  //     // eslint-disable-next-line
  //      e.response?.data.pipe(res)

  //     return
  //   }

  //   throw e
  // })
}
