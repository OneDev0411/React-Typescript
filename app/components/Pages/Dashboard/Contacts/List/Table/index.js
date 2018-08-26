import React, { Fragment } from 'react'
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
import ChangeStageContacts from '../Actions/ChangeStageContacts'

import TagsOverlay from '../../components/TagsOverlay'

import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers'

import { goTo } from '../../../../../../utils/go-to'
import { TruncatedColumn } from './styled'

class ContactsList extends React.Component {
  state = { selectedTagContact: [] }

  onSelectTagContact = selectedTagContact =>
    this.setState({ selectedTagContact: [selectedTagContact] })

  closeTagsOverlay = () => this.setState({ selectedTagContact: [] })

  openContact = id => {
    goTo(`/dashboard/contacts/${id}`, 'All Contacts')
  }

  columns = [
    {
      header: 'Name',
      id: 'name',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      render: ({ rowData: contact }) => <Name contact={contact} />
    },
    {
      header: 'Email',
      id: 'email',
      accessor: contact => getAttributeFromSummary(contact, 'email'),
      render: ({ rowData: contact }) => (
        <TruncatedColumn>
          {getAttributeFromSummary(contact, 'email')}
        </TruncatedColumn>
      )
    },
    {
      header: 'Phone',
      id: 'phone',
      accessor: contact => getAttributeFromSummary(contact, 'phone_number'),
      render: ({ rowData: contact }) => (
        <TruncatedColumn>
          {getAttributeFromSummary(contact, 'phone_number')}
        </TruncatedColumn>
      )
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
      type: 'button',
      text: 'Delete',
      inverse: true,
      display: ({ selectedRows }) => selectedRows.length > 0,
      onClick: this.props.onRequestDelete
    },
    {
      display: ({ selectedRows }) => selectedRows.length >= 2,
      render: ({ selectedRows }) => (
        <MergeContacts
          selectedRows={selectedRows}
          rowsUpdating={this.props.rowsUpdating}
          resetSelectedRows={this.props.resetSelectedRows}
        />
      )
    },
    {
      display: ({ selectedRows }) => selectedRows.length > 0,
      render: ({ selectedRows }) => (
        <TagContacts
          selectedRows={selectedRows}
          resetSelectedRows={this.props.resetSelectedRows}
        />
      )
    },
    {
      display: ({ selectedRows }) => selectedRows.length > 0,
      render: ({ selectedRows }) => (
        <ChangeStageContacts
          selectedRows={selectedRows}
          resetSelectedRows={this.props.resetSelectedRows}
        />
      )
    }
  ]

  getGridTrProps = (rowIndex, { original: row, isSelected }) => {
    if (this.props.isRowsUpdating && isSelected) {
      return {
        style: {
          opacity: 0.5,
          ponterEvents: 'none'
        }
      }
    }

    return {}
  }

  getGridTdProps = (colIndex, { column, rowData: row }) => {
    if (['plugin--selectable', 'delete-contact'].includes(column.id)) {
      return {
        onClick: e => e.stopPropagation()
      }
    }

    return {
      style: {
        cursor: 'pointer'
      },
      onClick: () => this.openContact(row.id)
    }
  }

  render() {
    const selectedRowsCount = this.props.selectedRows.length

    return (
      <Fragment>
        <Table
          plugins={{
            selectable: {
              persistent: true,
              storageKey: 'contacts',
              onChange: this.props.onChangeSelectedRows
            },
            loadable: {
              accuracy: 300, // px
              debounceTime: 300, // ms
              onTrigger: this.props.onRequestLoadMore
            },
            actionable: this.actions
          }}
          data={this.props.data}
          summary={{
            text:
              selectedRowsCount > 0
                ? '<strong style="color:#000;">[selectedRows]</strong> of [totalRows] contacts'
                : '[totalRows] contacts',
            selectedRows: selectedRowsCount,
            totalRows: this.props.listInfo.total || 0
          }}
          isFetching={this.props.isFetching}
          isFetchingMore={this.props.isFetchingMore}
          columns={this.columns}
          LoadingState={LoadingComponent}
          getTrProps={this.getGridTrProps}
          getTdProps={this.getGridTdProps}
          EmptyState={() => (
            <NoSearchResults description="Try typing another name, email, phone or tag." />
          )}
        />

        <TagsOverlay
          selectedContactsIds={this.state.selectedTagContact}
          isOpen={this.state.selectedTagContact.length > 0}
          closeOverlay={this.closeTagsOverlay}
        />
      </Fragment>
    )
  }
}

export default ContactsList
