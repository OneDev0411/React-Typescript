import React from 'react'
import Flex from 'styled-flex-component'

import { primary } from 'views/utils/colors'
import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

export default function Loading() {
  return (
    <Flex center style={{ padding: '50% 0' }}>
      <Spinner style={{ fill: primary, width: '6rem', height: '6rem' }} />
    </Flex>
  )
}
