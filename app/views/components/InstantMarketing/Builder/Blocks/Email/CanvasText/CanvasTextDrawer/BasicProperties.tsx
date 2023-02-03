import { Box } from '@material-ui/core'

import { TagColorProperty } from './properties/TagColorProperty'
import { TextColorProperty } from './properties/TextColorProperty'
import { TextFontSizeProperty } from './properties/TextFontSizeProperty'
import { TextStyleProperty } from './properties/TextStyleProperty'

export function BasicProperties() {
  return (
    <Box>
      <TextStyleProperty />
      <TextFontSizeProperty />
      <TextColorProperty />
      <TagColorProperty />
    </Box>
  )
}
