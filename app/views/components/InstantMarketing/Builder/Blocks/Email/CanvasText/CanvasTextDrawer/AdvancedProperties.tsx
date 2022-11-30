import { Box } from '@material-ui/core'

import { TextLineHeightProperty } from './properties/TextLineHeightProperty'
import { TextOpacityProperty } from './properties/TextOpacityProperty'
import { TextPaddingProperty } from './properties/TextPaddingProperty'
import { TextRotateProperty } from './properties/TextRotateProperty'
import { TextShadowProperty } from './properties/TextShadowProperty'

export function AdvancedProperties() {
  return (
    <Box>
      <TextLineHeightProperty />
      <TextOpacityProperty />
      <TextPaddingProperty />
      <TextRotateProperty />
      <TextShadowProperty />
    </Box>
  )
}
