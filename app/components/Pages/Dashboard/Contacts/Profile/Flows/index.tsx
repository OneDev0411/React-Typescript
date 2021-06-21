import React, { useMemo } from 'react'

import { mdiPlus } from '@mdi/js'

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
  const list = useMemo(() => (Array.isArray(flows) ? flows : []), [flows])

  return (
    <BasicSection title="Flows">
      {list.length > 0 && <List items={list} onStop={onStop} />}
      <AddToFlowButton
        activeFlows={[]}
        callback={addCallback}
        contacts={{ ids: [contactId] }}
        buttonRenderer={buttonProps => (
          <SectionButton
            label="Enroll To a Flow"
            icon={mdiPlus}
            onClick={e => buttonProps?.onClick(e)}
          />
        )}
      />
    </BasicSection>
  )
}

export default FlowsList
