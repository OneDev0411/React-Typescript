import { useEffectOnce } from 'react-use'

export function useCheckBrowser() {
  useEffectOnce(() => {
    const ua = window.navigator.userAgent
    const isIE = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0

    if (isIE) {
      window.location.href = '/unsupported'
    }
  })
}
