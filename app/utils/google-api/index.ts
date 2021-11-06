import { loadJS, unloadJS } from '@app/utils/load-js'

const scriptId = 'google-api-script'

export function loadGoogleAPIScript(onLoad?: () => void): void {
  if (isGoogleAPIScriptLoaded()) {
    return
  }

  loadJS('https://apis.google.com/js/api.js', scriptId, onLoad)
}

export function unloadGoogleAPIScript(): void {
  unloadJS(scriptId)
}

export function isGoogleAPIScriptLoaded(): boolean {
  return !!document.getElementById(scriptId)
}
