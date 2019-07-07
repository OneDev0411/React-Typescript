import { connect } from 'react-redux'

import React, { ReactNode } from 'react'

import { IAppState } from 'reducers'
import { createActiveFilters } from 'actions/filter-segments/active-filters'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import createFiltersFromSegment from '../Filters/helpers/create-filters-from-segment'

interface RenderProps {
  applyFilters: () => IContactAttributeFilter[]
}

interface Props {
  createFilters: (filters) => any
  getOriginFilters: () => IContactAttributeFilter[]
  children: (renderProps: RenderProps) => ReactNode
}

function OrganizeSyncedContactsButton(props: Props) {
  function applyFilters() {
    const filters = props.getOriginFilters()

    props.createFilters(createFiltersFromSegment({ filters }))

    return filters
  }

  return <>{props.children({ applyFilters })}</>
}

function mapStateToProps({ contacts }: IAppState) {
  const sourceDefinition = selectDefinitionByName(
    contacts.attributeDefs,
    'source_type'
  )

  const origin = 'Google'

  return {
    getOriginFilters: () => [
      {
        attribute_def: sourceDefinition.id,
        invert: false,
        value: origin
      }
    ]
  }
}

export default connect(
  mapStateToProps,
  dispatch => ({
    createFilters: filters => dispatch(createActiveFilters('contacts', filters))
  })
)(OrganizeSyncedContactsButton)
