import React from 'react'
import Table from '../../../../../../views/components/Grid/Table'

import Menu from './columns/Menu'
import TagsString from './columns/Tags'
import Name from './columns/Name'
import { LastTouchedCell } from './columns/LastTouched'

import { LoadingComponent } from './components/LoadingComponent'
import NoSearchResults from '../../../../../Partials/no-search-results'

import MergeContacts from '../Actions/MergeContacts'
import ExportContacts from '../Actions/ExportContactsButton'
import TagContacts from '../Actions/TagContacts'
import SendMlsListingCard from 'components/InstantMarketing/Flows/SendMlsListingCard'

import TagsOverlay from '../../components/TagsOverlay'

import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers'

import { Contact } from './columns/Contact'
import IconButton from '../../../../../../views/components/Button/IconButton'
import IconDeleteOutline from '../../../../../../views/components/SvgIcons/DeleteOutline/IconDeleteOutline'

class ContactsList extends React.Component {
  state = { selectedTagContact: [] }

  onSelectTagContact = selectedTagContact =>
    this.setState({ selectedTagContact: [selectedTagContact] })

  closeTagsOverlay = () => this.setState({ selectedTagContact: [] })

  columns = [
    {
      header: 'Name',
      id: 'name',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ rowData: contact }) => <Name contact={contact} />
    },
    {
      header: 'Contact',
      id: 'contact',
      accessor: contact => getAttributeFromSummary(contact, 'email'),
      render: ({ rowData: contact }) => <Contact contact={contact} />
    },
    {
      header: 'Last Touched',
      id: 'last_touched',
      sortable: false,
      render: ({ rowData: contact }) => <LastTouchedCell contact={contact} />
    },
    {
      header: 'Tags',
      id: 'tag',
      render: ({ rowData: contact }) => (
        <TagsString
          contact={contact}
          onSelectTagContact={this.onSelectTagContact}
        />
      )
    },
    {
      id: 'delete-contact',
      header: '',
      accessor: '',
      className: 'td--dropdown-container',
      sortable: false,
      width: '24px',
      render: ({ rowData: contact }) => (
        <Menu
          contactId={contact.id}
          handleOnDelete={this.props.onRequestDelete}
        />
      )
    }
  ]

  actions = [
    {
      render: ({ selectedRows }) => (
        <ExportContacts
          filters={this.props.filters}
          exportIds={selectedRows}
          disabled={this.props.isFetching}
        />
      )
    },
    {
      display: ({ selectedRows }) => selectedRows.length > 0,
      render: ({ selectedRows }) => (
        <SendMlsListingCard selectedRows={selectedRows}>
          Marketing
        </SendMlsListingCard>
      )
    },
    {
      display: ({ selectedRows }) => selectedRows.length > 0,
      render: ({ selectedRows, resetSelectedRows }) => (
        <TagContacts
          selectedRows={selectedRows}
          resetSelectedRows={resetSelectedRows}
        />
      )
    },
    {
      display: ({ selectedRows }) => selectedRows.length >= 2,
      render: ({ selectedRows, resetSelectedRows }) => (
        <MergeContacts
          selectedRows={selectedRows}
          rowsUpdating={this.props.rowsUpdating}
          resetSelectedRows={resetSelectedRows}
        />
      )
    },
    {
      display: ({ selectedRows }) => selectedRows.length > 0,
      render: rowData => (
        <IconButton
          size="small"
          appearance="outline"
          onClick={e => this.props.onRequestDelete(e, rowData)}
        >
          <IconDeleteOutline size={24} />
        </IconButton>
      )
    }
  ]

  getGridTrProps = (rowIndex, { isSelected }) => {
    if (this.props.isRowsUpdating && isSelected) {
      return {
        style: {
          opacity: 0.5,
          pointerEvents: 'none'
        }
      }
    }
  }

  render() {
    return (
      <div style={{ padding: '0 1.5em' }}>
        <Table
          plugins={{
            selectable: {
              persistent: true,
              storageKey: 'contacts'
            },
            loadable: {
              accuracy: 300, // px
              debounceTime: 300, // ms
              onTrigger: this.props.onRequestLoadMore
            },
            actionable: {
              actions: this.actions
            },
            sortable: {
              columns: [
                { label: 'Most Recent', value: 'updated_at' },
                { label: 'Last Touch', value: 'last_touch' },
                { label: 'Next Touch', value: 'next_touch' },
                { label: 'First name A-Z', value: 'display_name' },
                { label: 'First name Z-A', value: '-display_name' },
                { label: 'Last name A-Z', value: 'sort_field' },
                { label: 'Last name Z-A', value: '-sort_field' },
                { label: 'Created At', value: 'created_at' }
              ],
              onChange: this.props.handleChangeOrder
            }
          }}
          data={this.props.data}
          summary={{
            entityName: 'Contacts',
            total: this.props.listInfo.total || 0
          }}
          isFetching={this.props.isFetching}
          isFetchingMore={this.props.isFetchingMore}
          columns={this.columns}
          LoadingState={LoadingComponent}
          getTrProps={this.getGridTrProps}
          EmptyState={() => (
            <NoSearchResults description="Try typing another name, email, phone or tag." />
          )}
        />

        <TagsOverlay
          selectedContactsIds={this.state.selectedTagContact}
          isOpen={this.state.selectedTagContact.length > 0}
          closeOverlay={this.closeTagsOverlay}
        />
      </div>
    )
  }
}

export default ContactsList
