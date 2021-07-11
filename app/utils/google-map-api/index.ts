import { loadJS } from 'utils/load-js'
import idx from 'idx'
import config from 'config'

export const DEFAULT_KEY = config.google.api_key

export type GoogleMapLibrary =
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'

export interface GoogleMapAPIParams {
  key?: string
  libraries?: GoogleMapLibrary[]
  callback?: string
}

// Verify that the Google map and desired library are loaded
export function isMapLibrariesLoaded(libraries: GoogleMapLibrary[]) {
  let isMissedLibrary = false
  if (idx(window, w => w.google.maps)) {
    // Check for missing library
    if (libraries.length) {
      for (let i = 0; i < libraries.length; i += 1) {
        if (!window.google.maps.hasOwnProperty(libraries[i])) {
          isMissedLibrary = true
          break
        }
      }
    }

    if (isMissedLibrary) {
      return false
    }
    return true
  } else {
    return false
  }
}

// Create url of Google map API
export function createGoogleMapApiUrl({
  key = DEFAULT_KEY,
  libraries,
  callback
}: GoogleMapAPIParams) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/js'
  const keyPart = `?key=${key}`
  const librariesPart =
    libraries && libraries.length ? `&libraries=${libraries.join(',')}` : ''
  const callbackPart = callback ? `&callback=${callback}` : ''
  return `${baseUrl}${keyPart}${librariesPart}${callbackPart}`
}

// Load Google map API
export function loadMapLibraries(arg: GoogleMapAPIParams) {
  loadJS(createGoogleMapApiUrl(arg))
}
