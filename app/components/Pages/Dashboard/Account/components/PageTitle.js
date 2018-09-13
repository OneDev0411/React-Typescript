import React from 'react'
import Flex from 'styled-flex-component'

import { H1 } from '../../../../../views/components/Typography/headings'

const PageTitle = ({ title }) => (
  <Flex
    alignCenter
    style={{ height: '71px', padding: '0 2em', marginBottom: '2em' }}
  >
    <H1>{title}</H1>
  </Flex>
)

export default PageTitle
