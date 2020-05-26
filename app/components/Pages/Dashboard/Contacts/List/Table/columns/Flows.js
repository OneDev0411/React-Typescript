import React from 'react'
import styled from 'styled-components'
import { Tooltip } from '@material-ui/core'

import { mdiLightningBolt } from '@mdi/js'

import AddToFlowButton from 'components/AddToFlowButton'
import ALinkToClosable from 'components/ALinkToClosable'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const commonStyle = `
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  > svg {
    width: 1em;
    height: 1em;
    margin-right: 0.25rem;
  }
`
const Link = styled(ALinkToClosable)`
  ${commonStyle}
  &:hover {
    text-decoration: none;
  }
`

const AddFlow = styled.span`
  ${commonStyle}
`

export default function FlowCell(props) {
  const { flowsCount, contactId } = props

  if (flowsCount === 0) {
    return (
      <AddToFlowButton
        contacts={{ ids: [contactId] }}
        callback={props.callback}
        buttonRenderer={buttonProps => (
          <Tooltip title="Add to flow">
            <AddFlow {...buttonProps}>
              <SvgIcon size={muiIconSizes.small} path={mdiLightningBolt} />+
            </AddFlow>
          </Tooltip>
        )}
      />
    )
  }

  const params = new URL(document.location).searchParams

  return (
    <Link
      noStyle
      to={{
        pathname: `/dashboard/contacts/${contactId}`,
        state: {
          id: contactId,
          s: parseInt(params.get('s'), 10)
        }
      }}
    >
      <SvgIcon size={muiIconSizes.small} path={mdiLightningBolt} />
      {flowsCount}
    </Link>
  )
}
