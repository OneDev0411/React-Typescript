import * as React from 'react'
import { render } from '@testing-library/react'

import attributeDefs from 'fixtures/contacts/attribute-defs.json'
import tags from 'fixtures/contacts/tags.json'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import { TagsList } from '.'

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
      />
    )
  })
})
