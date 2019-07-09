import { connect } from 'react-redux'

import React, { ReactNode } from 'react'

import { IAppState } from 'reducers'
import { createActiveFilters } from 'actions/filter-segments/active-filters'

import createFiltersFromSegment from '../Filters/helpers/create-filters-from-segment'
import { getOrganizeSyncedContactsAttributeFilters } from './helpers'

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
  return {
    getOriginFilters: () =>
      getOrganizeSyncedContactsAttributeFilters(contacts.attributeDefs)
  }
}

export default connect(
  mapStateToProps,
  dispatch => ({
    createFilters: filters => dispatch(createActiveFilters('contacts', filters))
  })
)(OrganizeSyncedContactsButton)
