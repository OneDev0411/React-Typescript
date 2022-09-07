import React, { ReactNode } from 'react'

import { connect } from 'react-redux'

import { IAttributeDefsState } from '@app/reducers/contacts/attributeDefs'
import { selectContactAttributeDefs } from '@app/selectors/contacts'
import { createActiveFilters } from 'actions/filter-segments/active-filters'
import { OAuthProvider } from 'constants/contacts'
import { IAppState } from 'reducers'

import createFiltersFromSegment from '../Filters/helpers/create-filters-from-segment'

import { getOrganizeSyncedContactsList } from './helpers'

interface RenderProps {
  applyFilters: () => IContactAttributeFilter[]
}

interface Props {
  attributeDefs: IAttributeDefsState
  provider: OAuthProvider
  createFilters: (filters) => any
  getOrganizedContactsList: () => Partial<IContactList>
  children: (renderProps: RenderProps) => ReactNode
}

function OrganizeSyncedContactsButton(props: Props) {
  function applyFilters() {
    const segment = props.getOrganizedContactsList()

    props.createFilters(
      createFiltersFromSegment(segment, {
        attributeDefs: props.attributeDefs
      })
    )

    return segment.filters || []
  }

  return <>{props.children({ applyFilters })}</>
}

function mapStateToProps(state: IAppState, props: Props) {
  const attributeDefs = selectContactAttributeDefs(state)

  return {
    attributeDefs,
    getOrganizedContactsList: () =>
      getOrganizeSyncedContactsList(attributeDefs, props.provider)
  }
}

export default connect<
  Pick<Props, 'getOrganizedContactsList'>,
  Pick<Props, 'createFilters'>
>(mapStateToProps, dispatch => ({
  createFilters: filters => dispatch(createActiveFilters('contacts', filters))
}))(OrganizeSyncedContactsButton)
