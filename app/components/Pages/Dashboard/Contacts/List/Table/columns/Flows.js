import React from 'react'
import styled from 'styled-components'

import ALinkToClosable from 'components/ALinkToClosable'
import IconThunderbolt from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'

const Link = styled(ALinkToClosable)`
  display: flex;
  align-items: center;
  &:hover {
    text-decoration: none;
  }

  > svg {
    width: 1em;
    height: 1em;
    margin-right: 0.25rem;
  }
`

export default function FlowCell(props) {
  const { flowsCount, contactId } = props
  const pathname = `/dashboard/contacts/${contactId}`
  const params = new URL(document.location).searchParams

  return (
    <Link
      noStyle
      to={{
        pathname,
        state: {
          id: contactId,
          s: parseInt(params.get('s'), 10)
        }
      }}
    >
      <IconThunderbolt />
      {flowsCount}
    </Link>
  )
}
