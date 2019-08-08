import { OAuthProvider } from 'constants/contacts'

import { connect } from 'react-redux'

import React, { ReactNode } from 'react'

import { IAppState } from 'reducers'
import { createActiveFilters } from 'actions/filter-segments/active-filters'

import createFiltersFromSegment from '../Filters/helpers/create-filters-from-segment'
import { getOrganizeSyncedContactsList } from './helpers'

interface RenderProps {
  applyFilters: () => IContactAttributeFilter[]
}

interface Props {
  provider: OAuthProvider
  createFilters: (filters) => any
  getOrganizedContactsList: () => IContactList
  children: (renderProps: RenderProps) => ReactNode
}

function OrganizeSyncedContactsButton(props: Props) {
  function applyFilters() {
    const segment = props.getOrganizedContactsList()

    props.createFilters(createFiltersFromSegment(segment))

    return segment.filters || []
  }

  return <>{props.children({ applyFilters })}</>
}

function mapStateToProps({ contacts }: IAppState, props: Props) {
  return {
    getOrganizedContactsList: () =>
      getOrganizeSyncedContactsList(contacts.attributeDefs, props.provider)
  }
}

export default connect(
  mapStateToProps,
  dispatch => ({
    createFilters: filters => dispatch(createActiveFilters('contacts', filters))
  })
)(OrganizeSyncedContactsButton)
