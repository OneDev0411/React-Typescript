import React from 'react'
import pure from 'recompose/pure'
import Flex from 'styled-flex-component'

import Video from './Video'
import SocialListings from './SocialListings'

function Cards() {
  return (
    <div>
      <Video />
      <Flex>
        <SocialListings />
      </Flex>
    </div>
  )
}

export default pure(Cards)
