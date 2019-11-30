import React from 'react'

import { RichTextFeature } from './features/RichText'
import { EmojiFeature } from './features/Emoji'

export const DEFAULT_EDITOR_FEATURES = (
  <>
    <RichTextFeature />
    <EmojiFeature />
  </>
)
