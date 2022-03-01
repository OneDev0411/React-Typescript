import { ReactNode } from 'react'

import { fireEvent, render, RenderResult } from '@testing-library/react'
import { keyBy } from 'lodash'
import { FieldRenderProps } from 'react-final-form'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import deal1 from 'fixtures/deal/164ca424-6732-11e9-82bf-0a95998482ac.json'
import checklistsArray from 'fixtures/deal/checklists.json'
import dealWithDraft from 'fixtures/deal/deal-with-draft-files.json'
import deal2 from 'fixtures/deal/fa2126f8-6740-11e9-90e4-0a95998482ac.json'
import tasksArray from 'fixtures/deal/tasks.json'
import file1 from 'fixtures/files/file1.json'

import { TestBed } from '../../../../../../tests/unit/TestBed'

import AddDealFile, { AddDealFile as AddDealFileBase } from '.'

const checklists = keyBy(checklistsArray as IDealChecklist[], 'id')
const tasks = keyBy<IDealTask>(tasksArray as any, 'id')
const deals = [deal1, deal2, dealWithDraft] as any[]

const input: FieldRenderProps<any>['input'] = {
  name: 'test',
  onBlur: () => {},
  onFocus: () => {},
  onChange: () => {},
  value: [] as IFile[]
}

const AddDealFileTestBed = ({ children }: { children: ReactNode }) => {
  const dealsState = {
    list: keyBy(deals, 'id'),
    checklists,
    tasks,
    envelopes: {}
  }

  return (
    <TestBed
      reduxState={{
        deals: dealsState
      }}
    >
      {children}
    </TestBed>
  )
}

describe('AddDealFile component', () => {
  // https://gitlab.com/rechat/web/issues/2963
  test('renders', () => {
    const mockStore = createStore((state, action) => state, {
      deals: { checklists: {}, tasks: {}, envelopes: {} }
    })

    const container = render(
      <Provider store={mockStore}>
        <AddDealFileBase
          value={[]}
          onChange={input.onChange}
          initialAttachments={[]}
        />
      </Provider>
    )

    expect(container).toMatchSnapshot()
  })

  test('it selects deal files', () => {
    const onChange = jest.fn()
    const $ = render(
      <AddDealFileTestBed>
        <AddDealFile value={[]} onChange={onChange} initialAttachments={[]} />
      </AddDealFileTestBed>
    )

    toggleDealFiles($, '7 SW 7 Alley  Unit 7', ['Information About'])

    expect(onChange).toBeCalledWith([
      expect.objectContaining({
        id: '678d8af0-67fb-11e9-8a19-0a95998482ac'
      })
    ])
  })

  /**
   * https://gitlab.com/rechat/web/issues/3386
   */
  test('it preserves uploaded attachments when an attachment is added from deals', () => {
    const onChange = jest.fn()
    const $ = render(
      <AddDealFileTestBed>
        <AddDealFile
          value={[file1] as any}
          onChange={onChange}
          initialAttachments={[]}
        />
      </AddDealFileTestBed>
    )

    toggleDealFiles($, '7 SW 7 Alley  Unit 7', ['Information About'])

    expect(onChange).toBeCalledWith([
      file1,
      expect.objectContaining({
        id: '678d8af0-67fb-11e9-8a19-0a95998482ac'
      })
    ])
  })

  /**
   * https://gitlab.com/rechat/web/issues/3387
   */
  test('Unorganized (draft) files are suggested and selectable', () => {
    const onChange = jest.fn()
    const $ = render(
      <AddDealFileTestBed>
        <AddDealFile value={[]} onChange={onChange} initialAttachments={[]} />
      </AddDealFileTestBed>
    )

    toggleDealFiles($, '3508  Springbrook Street', ['Codal_p_588921_0.pdf'])

    expect(onChange).toBeCalledWith([
      expect.objectContaining({ id: dealWithDraft.files[0].id })
    ])
  })
})

function toggleDealFiles(
  $: RenderResult,
  dealName: string,
  dealFileNames: string[]
) {
  // Open deal selector drawer
  fireEvent.click($.getByText('Attach from deals'))

  // Select the deal. It will open deal file selector drawer
  fireEvent.click(
    $.getByText(dealName, {
      normalizer: text => text
    })
  )
  dealFileNames.forEach(dealFileName => {
    fireEvent.click($.getByText(dealFileName, { exact: false }))
  })
  fireEvent.click($.getByText('Next'))
}
