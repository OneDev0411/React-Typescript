import { useRef, useState } from 'react'

import {
  FontManager,
  FONT_FAMILY_DEFAULT,
  OPTIONS_DEFAULTS,
  FontList,
  Options as FontOptions
} from '@samuelmeuli/font-manager'
import { useEffectOnce } from 'react-use'

import config from 'config'

export function useFonts(
  options?: Partial<FontOptions>
): [FontList, Nullable<FontManager>] {
  const fontManager = useRef<Nullable<FontManager>>(null)
  const [list, setList] = useState<FontList>(new Map())

  useEffectOnce(() => {
    const load = async () => {
      fontManager.current = new FontManager(
        config.google.api_key,
        FONT_FAMILY_DEFAULT,
        {
          ...OPTIONS_DEFAULTS,
          limit: options?.limit ?? 100,
          ...options
        }
      )

      const list = await fontManager.current.init()

      setList(list)
    }

    load()
  })

  return [list, fontManager.current]
}
