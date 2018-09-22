import React from 'react'
import Flex from 'styled-flex-component'

import { H1 } from '../../../../../../../views/components/Typography/headings'

import Avatar from './Avatar'
import { getAttributeFromSummary } from '../../../../../../../models/contacts/helpers'

// import { LastTouched } from './LastTouched'

export function Catalog(props) {
  const { contact } = props

  return (
    <Flex>
      <Avatar contact={contact} />
      <Flex column style={{ padding: '0.5em 1.5em' }}>
        <H1 style={{ lineHeight: 1.5 }}>
          {getAttributeFromSummary(contact, 'display_name')}
        </H1>
        {/* <LastTouched contact={contact} /> */}
        <div>
          Last Touch was <span style={{ fontWeight: 600 }}>2 days ago</span>.
        </div>
      </Flex>
    </Flex>
  )
}
