import React from 'react'
import { render } from '@testing-library/react'

import deal from 'fixtures/deal/live-seller.json'

import { DocumentRow } from '.'

describe('Select Deal File Drawer', () => {
  it('should render the component', () => {
    const tasks = deal.checklists.flatMap(checklist => checklist.tasks)

    render(
      // @ts-ignore
      <DocumentRow
        deal={deal}
        checklists={deal.checklists}
        tasks={tasks}
        envelopes={deal.envelopes || []}
        initialAttachments={{}}
        selectedItems={[]}
        onToggleItem={() => {}}
        moveTaskFile={() => {}}
        notify={() => {}}
      />
    )
  })
})
