import React from 'react'
import Flex from 'styled-flex-component'

import {
  H3,
  H4
} from '../../../../../../../views/components/Typography/headings'

const TagsOverlay = ({ text }) => (
  <Flex alignBaseline>
    <H3>Tags</H3>
    &nbsp;for&nbsp;
    <H4>{text}</H4>
  </Flex>
)

export default TagsOverlay
