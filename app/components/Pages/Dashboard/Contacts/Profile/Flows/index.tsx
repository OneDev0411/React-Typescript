import React from 'react'

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
    <Section title="Flows" style={{ padding: '0 1rem' }}>
      {flows && flows.length > 0 ? (
        <List items={flows} onStop={onStop} />
      ) : (
        <ZeroState addCallback={addCallback} contactId={contactId} />
      )}
    </Section>
  )
}

export default FlowsList
