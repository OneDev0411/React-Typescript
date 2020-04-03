import React from 'react'
import { Box, Tooltip } from '@material-ui/core'

import styled from 'styled-components'

import AddToFlowButton from 'components/AddToFlowButton'
import IconThunderbolt from 'components/SvgIcons/Thunderbolt/ThunderboltIcon'

import { Section } from '../components/Section'
import List from './List/List'

const AddFlow = styled.span`
  color: ${props => props.theme.palette.grey['500']};
  cursor: pointer;
  > svg {
    fill: ${props => props.theme.palette.grey['500']};
    width: 0.8em;
    height: 0.8em;
    margin-right: 0.25rem;
  }
`

interface Props {
  addCallback: () => void
  contactId: UUID
  flows: TBrandFlow<'steps'>[] | null
  onStop: (flowId: UUID) => Promise<void>
}

function FlowsList({ flows, contactId, onStop, addCallback }: Props) {
  return (
    <Section
      title="Flows"
      setting={{
        tooltip: 'Manage Flows',
        href: '/dashboard/account/flows'
      }}
    >
      <Box px={3}>
        {Array.isArray(flows) && <List items={flows} onStop={onStop} />}
        <AddToFlowButton
          activeFlows={[]}
          callback={addCallback}
          contacts={{ ids: [contactId] }}
          buttonRenderer={buttonProps => (
            <Tooltip title="Add to Flow">
              <AddFlow {...buttonProps}>
                <IconThunderbolt />+
              </AddFlow>
            </Tooltip>
          )}
        />
      </Box>
    </Section>
  )
}

export default FlowsList
