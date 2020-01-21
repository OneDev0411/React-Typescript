import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getAttributeFromSummary } from 'models/contacts/helpers'

import IconInfoOutline from 'components/SvgIcons/InfoOutline/IconInfoOutline'

import { Table } from 'components/Grid/Table'

import Tooltip from 'components/tooltip'

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
import { Contact } from './columns/Contact'
import LastTouched from './columns/LastTouched'

import { SORT_FIELD_SETTING_KEY } from '../constants'

const IconLastTouch = styled(IconInfoOutline)`
  margin-left: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  transition: 0.2s ease-in all;

  &:hover {
    opacity: 0.5;
  }
`

class ContactsList extends React.Component {
  state = { selectedTagContact: [] }

  onSelectTagContact = selectedTagContact =>
    this.setState({ selectedTagContact: [selectedTagContact] })

  closeTagsOverlay = () => this.setState({ selectedTagContact: [] })

  columns = [
    {
      header: 'Name',
      id: 'name',
      primary: true,
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ row: contact }) => <Name contact={contact} />
    },
    {
      header: 'Contact',
      id: 'contact',
      accessor: contact => getAttributeFromSummary(contact, 'email'),
      render: ({ row: contact }) => <Contact contact={contact} />
    },
    {
      header: 'Tags',
      id: 'tag',
      render: ({ row: contact }) => (
        <TagsString
          contact={contact}
          onSelectTagContact={this.onSelectTagContact}
        />
      )
    },
    {
      header: () => (
        <>
          Last Touch
          <Tooltip
            placement="bottom"
            caption="This shows the last time you were in touch with a contact. Save events to keep it updated."
          >
            <IconLastTouch />
          </Tooltip>
        </>
      ),
      id: 'last_touched',
      sortable: false,
      render: ({ row: contact }) => <LastTouched contact={contact} />
    },
    {
      header: 'Flows',
      id: 'flows',
      sortable: false,
      render: ({ row: contact }) => (
        <FlowCell
          callback={async () => {
            await this.props.reloadContacts()
          }}
          contactId={contact.id}
          flowsCount={Array.isArray(contact.flows) ? contact.flows.length : 0}
        />
      )
    },
    {
      id: 'delete-contact',
      sortable: false,
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
      <div>
        <Table
          rows={props.data}
          totalRows={props.listInfo.total || 0}
          summary={total => `${total} Contacts`}
          loading={this.getLoading()}
          columns={this.columns}
          LoadingState={LoadingComponent}
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
          infiniteScroll={{
            accuracy: 300, // px
            debounceTime: 300, // ms
            container: props.tableContainerId,
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
          EmptyState={() => (
            <NoSearchResults description="Try typing another name, email, phone or tag." />
          )}
        />

        <TagsOverlay
          closeOverlay={this.closeTagsOverlay}
          isOpen={state.selectedTagContact.length > 0}
          selectedContactsIds={state.selectedTagContact}
          handleChangeContactsAttributes={props.handleChangeContactsAttributes}
        />
      </div>
    )
  }
}

export default connect(({ user }) => ({ user }))(ContactsList)
