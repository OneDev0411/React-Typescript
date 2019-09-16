import * as React from 'react'
import { fireEvent, render } from '@testing-library/react'

import attributeDefs from 'fixtures/contacts/attribute-defs.json'
import tags from 'fixtures/contacts/tags.json'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import { TagsList } from './index'

describe('tagsList', () => {
  it('should render', () => {
    render(
      <TagsList
        attributeDefs={attributeDefs as IAttributeDefsState}
        activeFilters={{}}
        resetActiveFilters={() => null}
        onFilterChange={() => null}
        changeActiveFilterSegment={() => Promise.resolve()}
        existingTags={tags}
        isFetching={false}
        updateActiveFilter={() => null}
        isActive
      />
    )
  })

  it('should call onFilterChange with correct value (#2894)', done => {
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
        attributeDefs={attributeDefs as IAttributeDefsState}
        activeFilters={activeFilters}
        resetActiveFilters={() => null}
        changeActiveFilterSegment={() => Promise.resolve()}
        onFilterChange={onFilterChange}
        existingTags={tags}
        isFetching={false}
        updateActiveFilter={() => null}
        isActive
      />
    )

    fireEvent.click(getByText('100 Contacts'))
    setImmediate(() => {
      expect(onFilterChange).toBeCalledWith({
        filters: [
          {
            value: '100 Contacts',
            invert: false,
            attribute_def: 'df5a82fb-b163-4193-880d-bb85bb14d5f2'
          }
        ]
      })
      done()
    })
  })
})
