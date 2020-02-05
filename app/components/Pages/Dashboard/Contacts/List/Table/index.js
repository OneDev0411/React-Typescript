import React from 'react'
import { connect } from 'react-redux'

import { getAttributeFromSummary } from 'models/contacts/helpers'

import { Table } from 'components/Grid/Table'

import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'

import { TableActions } from './Actions'

import TagsOverlay from '../../components/TagsOverlay'
import NoSearchResults from '../../../../../Partials/no-search-results'

import { LoadingComponent } from './components/LoadingComponent'

import Menu from './columns/Menu'
import Avatar from './columns/Avatar'
import Name from './columns/Name'
import TagsString from './columns/Tags'
import FlowCell from './columns/Flows'
import LastTouched from './columns/LastTouched'

import { SORT_FIELD_SETTING_KEY } from '../constants'

class ContactsList extends React.Component {
  state = { selectedTagContact: [] }

  onSelectTagContact = selectedTagContact =>
    this.setState({ selectedTagContact: [selectedTagContact] })

  closeTagsOverlay = () => this.setState({ selectedTagContact: [] })

  columns = [
    {
      id: 'name',
      primary: true,
      width: '32%',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ row: contact }) => <Name contact={contact} />
    },
    {
      id: 'last_touched',
      sortable: false,
      width: '20%',
      render: ({ row: contact }) => <LastTouched contact={contact} />
    },
    {
      id: 'flows',
      sortable: false,
      width: '8%',
      render: ({ row: contact }) => (
        <FlowCell
          contactId={contact.id}
          flowsCount={Array.isArray(contact.flows) ? contact.flows.length : 0}
        />
      )
    },
    {
      id: 'tag',
      width: '30%',
      render: ({ row: contact }) => (
        <TagsString
          contact={contact}
          onSelectTagContact={this.onSelectTagContact}
        />
      )
    },
    {
      id: 'delete-contact',
      sortable: false,
      width: '5%',
      render: ({ row: contact }) => (
        <Menu
          contactId={contact.id}
          handleOnDelete={this.props.onRequestDelete}
        />
      )
    }
  ]

  sortableColumns = [
    { label: 'Most Recent', value: 'updated_at', ascending: false },
    { label: 'Last Touch', value: 'last_touch', ascending: false },
    { label: 'First name A-Z', value: 'display_name', ascending: true },
    { label: 'First name Z-A', value: 'display_name', ascending: false },
    { label: 'Last name A-Z', value: 'sort_field', ascending: true },
    { label: 'Last name Z-A', value: 'sort_field', ascending: false },
    { label: 'Created At', value: 'created_at', ascending: true }
  ]

  getLoading = () => {
    if (
      !this.props.isFetching &&
      !this.props.isFetchingMore &&
      !this.props.isFetchingMoreBefore
    ) {
      return null
    }

    if (this.props.isFetching) {
      return 'middle'
    }

    if (this.props.isFetchingMore) {
      return 'bottom'
    }

    if (this.props.isFetchingMoreBefore) {
      return 'top'
    }
  }

  getDefaultSort = () => {
    return this.sortableColumns.find(item => item.value === this.props.order)
  }

  render() {
    const { props, state } = this

    return (
      <>
        <Table
          rows={props.data}
          totalRows={props.listInfo.total || 0}
          summary={total => `${total} Contacts`}
          loading={this.getLoading()}
          columns={this.columns}
          LoadingStateComponent={LoadingComponent}
          sorting={{
            columns: this.sortableColumns,
            defaultSort: this.getDefaultSort(),
            onChange: async item => {
              props.handleChangeOrder(item)

              await putUserSetting(SORT_FIELD_SETTING_KEY, item.value)
              props.dispatch(getUserTeams(props.user))
            }
          }}
          selection={{
            defaultRender: ({ row }) => <Avatar contact={row} />
          }}
          infiniteScrolling={{
            accuracy: 300, // px
            debounceTime: 300, // ms
            container: this.props.tableContainerId,
            onScrollBottom: props.onRequestLoadMore,
            onScrollTop: props.onRequestLoadMoreBefore
          }}
          TableActions={({ state, dispatch }) => (
            <TableActions
              state={state}
              dispatch={dispatch}
              filters={props.filters}
              isFetching={props.isFetching}
              totalRowsCount={props.listInfo.total}
              reloadContacts={this.props.reloadContacts}
              onRequestDelete={this.props.onRequestDelete}
              handleChangeContactsAttributes={
                props.handleChangeContactsAttributes
              }
            />
          )}
          EmptyStateComponent={() => (
            <NoSearchResults description="Try typing another name, email, phone or tag." />
          )}
        />

        <TagsOverlay
          closeOverlay={this.closeTagsOverlay}
          isOpen={state.selectedTagContact.length > 0}
          selectedContactsIds={state.selectedTagContact}
          handleChangeContactsAttributes={props.handleChangeContactsAttributes}
        />
      </>
    )
  }
}

export default connect(({ user }) => ({ user }))(ContactsList)
