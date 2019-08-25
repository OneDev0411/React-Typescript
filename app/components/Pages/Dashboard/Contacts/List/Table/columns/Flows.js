import React from 'react'
import styled from 'styled-components'

import { green, primary } from 'views/utils/colors'
import ALinkToClosable from 'components/ALinkToClosable'
import TextIconButton from 'components/Button/TextIconButton'
import AddToFlowButton from 'components/AddToFlowButton'
import IconThunderbolt from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'
import IconThunderboltOutline from 'components/SvgIcons/ThunderboltOutline/IconThunderboltOutline'

const Link = styled(ALinkToClosable)`
  display: flex;
  align-items: center;

  &:hover {
    > svg {
      fill: ${primary};
    }
  }

  > svg {
    width: 1em;
    height: 1em;
    fill: ${green.A100};
    margin-right: 0.5rem;
  }
`

export default function FlowCell(props) {
  const { flowsCount, contactId } = props

  if (flowsCount === 0) {
    return (
      <AddToFlowButton
        contacts={{ ids: [contactId] }}
        callback={props.callback}
        buttonRenderer={buttonProps => (
          <TextIconButton
            text="Add to Flow"
            iconLeft={IconThunderboltOutline}
            size="small"
            className="ghost primaryHover"
            iconSize="large"
            {...buttonProps}
          />
        )}
      />
    )
  }

  const pathname = `/dashboard/contacts/${contactId}`
  const params = new URL(document.location).searchParams

  return (
    <Link
      to={{
        pathname,
        state: {
          id: contactId,
          s: parseInt(params.get('s'), 10)
        }
      }}
    >
      <IconThunderbolt />
      {`Active in ${flowsCount} Flow${flowsCount > 1 ? 's' : ''}`}
    </Link>
  )
}
