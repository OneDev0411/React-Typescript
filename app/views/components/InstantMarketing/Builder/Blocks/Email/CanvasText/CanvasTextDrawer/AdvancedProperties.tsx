import { Box } from '@material-ui/core'

import { TagCornerRadius } from './properties/TagCornerRadius'
import { TextLetterSpacingProperty } from './properties/TextLetterSpacing'
import { TextLineHeightProperty } from './properties/TextLineHeightProperty'
import { TextOpacityProperty } from './properties/TextOpacityProperty'
import { TextPaddingProperty } from './properties/TextPaddingProperty'
import { TextRotateProperty } from './properties/TextRotateProperty'
import { TextShadowProperty } from './properties/TextShadowProperty'

export function AdvancedProperties() {
  return (
    <Box>
      <TextLetterSpacingProperty />
      <TextLineHeightProperty />
      <TextOpacityProperty />
      <TextPaddingProperty />
      <TextRotateProperty />
      <TagCornerRadius />
      <TextShadowProperty />
    </Box>
  )
}
