import React from 'react'
import { KeyBindingUtil } from 'draft-js'
import { DraftJsPlugin } from 'draft-js-plugins-editor'

export const linkKeyBinding: DraftJsPlugin['keyBindingFn'] = (
  e: React.KeyboardEvent<{}>
) => {
  if (e.keyCode === 75 /* `K` key */ && KeyBindingUtil.hasCommandModifier(e)) {
    return 'link'
  }

  return undefined
}
