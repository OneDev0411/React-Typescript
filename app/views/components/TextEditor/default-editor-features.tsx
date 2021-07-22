import React from 'react'

import { EmojiFeature } from './features/Emoji'
import { RichTextFeature } from './features/RichText'

export const DEFAULT_EDITOR_FEATURES = (
  <>
    <RichTextFeature />
    <EmojiFeature />
  </>
)
