import LZString from 'lz-string'
import { Konva } from 'pikaso'

export function parseState(state: Nullable<string>): Nullable<{
  label: Konva.TextConfig
  tag: Konva.RectConfig
  root: Konva.RectConfig
}> {
  try {
    if (!state) {
      return null
    }

    const decompressed = LZString.decompressFromEncodedURIComponent(state)

    if (!decompressed) {
      return null
    }

    return JSON.parse(decompressed)
  } catch (e) {
    return null
  }
}
