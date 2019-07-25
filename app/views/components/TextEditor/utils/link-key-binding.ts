import React from 'react'
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'

export function linkKeyBinding(e: React.KeyboardEvent<{}>): string {
  if (e.keyCode === 75 /* `K` key */ && KeyBindingUtil.hasCommandModifier(e)) {
    return 'link'
  }

  return getDefaultKeyBinding(e)!
}
