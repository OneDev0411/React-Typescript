import React from 'react'

import { mdiLightningBolt } from '@mdi/js'

import AddToFlowButton from 'components/AddToFlowButton'

import List from './List/List'
import { BasicSection } from '../components/Section/Basic'
import { SectionButton } from '../components/Section/Button'

interface Props {
  addCallback: () => void
  contactId: UUID
  flows: TBrandFlow<'steps'>[] | null
  onStop: (flowId: UUID) => Promise<void>
}

function FlowsList({ flows, contactId, onStop, addCallback }: Props) {
  return (
    <BasicSection>
      {Array.isArray(flows) && <List items={flows} onStop={onStop} />}
      <AddToFlowButton
        activeFlows={[]}
        callback={addCallback}
        contacts={{ ids: [contactId] }}
        buttonRenderer={buttonProps => (
          <SectionButton
            label="Enroll To a Flow"
            icon={mdiLightningBolt}
            onClick={e => buttonProps?.onClick(e)}
          />
        )}
      />
    </BasicSection>
  )
}

export default FlowsList
