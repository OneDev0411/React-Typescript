import React from 'react'
import { Tooltip } from '@material-ui/core'

import { H3 } from 'components/Typography/headings'
import IconCog from 'components/SvgIcons/Cog/IconCog'

import { disabledColor } from 'views/utils/colors'

import { Section } from '../components/Section'

import { List } from './List'
import ZeroState from './ZeroState'

interface Props {
  flows?: IBrandFlow[]
  contactId: UUID
  onStop: (flowId: UUID) => Promise<void>
  addCallback: () => void
}

function FlowsList({ flows = [], contactId, onStop, addCallback }: Props) {
  return (
    <Section
      style={{ padding: '0 1rem' }}
      titleRenderer={() => (
        <>
          <H3 style={{ margin: 0 }}>Flows</H3>
          <Tooltip placement="left" title="Manage Flows">
            <a
              href="/dashboard/account/flows"
              style={{
                display: 'flex'
              }}
            >
              <IconCog
                style={{
                  width: '1rem',
                  height: '1rem'
                }}
                fill={disabledColor}
              />
            </a>
          </Tooltip>
        </>
      )}
    >
      {flows && flows.length > 0 ? (
        <List items={flows} onStop={onStop} />
      ) : (
        <ZeroState addCallback={addCallback} contactId={contactId} />
      )}
    </Section>
  )
}

export default FlowsList
