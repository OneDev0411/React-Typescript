import * as React from 'react'

import attributeDefs from 'fixtures/contacts/attribute-defs.json'
import tags from 'fixtures/contacts/tags.json'
import { IAttributeDefsState } from 'reducers/contacts/attributeDefs'

import { renderWithTheme } from '../../../../../../../tests/unit/utils/render-with-theme'

import { TagsList } from '.'

describe('tagsList', () => {
  it('should render', () => {
    renderWithTheme(
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
