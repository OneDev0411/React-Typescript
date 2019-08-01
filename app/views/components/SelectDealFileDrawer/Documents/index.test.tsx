import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

// eslint-disable-next-line import/no-unresolved
import deal from 'fixtures/deal/live-seller'

import { DocumentRow } from '.'

describe('Select Deal File Drawer', () => {
  it('should render the component', () => {
    const tasks = deal.checklists.flatMap(checklist => checklist.tasks)

    const wrapper = render(
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

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
