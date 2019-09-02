import { fireEvent, render } from '@testing-library/react'
import attributeDefs from 'fixtures/contacts/attribute-defs' // eslint-disable-line
import tags from 'fixtures/contacts/tags' // eslint-disable-line
import * as React from 'react'

import { TagsList } from './index'

describe('tagsList', () => {
  it('should render', () => {
    render(
      <TagsList
        attributeDefs={attributeDefs}
        activeFilters={{}}
        resetActiveFilters={() => {}}
        onFilterChange={() => {}}
        existingTags={tags}
        isFetching={false}
        updateActiveFilter={() => {}}
      />
    )
  })

  it('should call onFilterChange with correct value (#2894)', () => {
    const onFilterChange = jest.fn()

    const activeFilters = {
      'df5a82fb-b163-4193-880d-bb85bb14d5f2-1': {
        id: 'df5a82fb-b163-4193-880d-bb85bb14d5f2',
        isActive: false,
        values: [
          {
            label: '100 Contacts',
            value: '100 Contacts'
          }
        ],
        operator: {
          name: 'is',
          default: true
        }
      },
      'openHouse-2': {
        id: 'openHouse',
        isActive: false,
        values: [
          {
            label: '6000 Merrymount Road - Jun 24, 2019',
            value: '654e871d-2490-4b04-b57a-255344438e71'
          }
        ],
        operator: {
          name: 'is'
        }
      }
    }
    const { getByText } = render(
      <TagsList
        attributeDefs={attributeDefs}
        activeFilters={activeFilters}
        resetActiveFilters={() => {}}
        onFilterChange={onFilterChange}
        existingTags={tags}
        isFetching={false}
        updateActiveFilter={() => {}}
      />
    )

    fireEvent.click(getByText('100 Contacts'))
    expect(onFilterChange).toBeCalledWith({
      filters: [
        {
          value: '100 Contacts',
          invert: false,
          attribute_def: 'df5a82fb-b163-4193-880d-bb85bb14d5f2'
        }
      ]
    })
  })
})
