import React from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'

import { getAttributeFromSummary } from 'models/contacts/helpers'
import SendMlsListingCard from 'components/InstantMarketing/adapters/SendMlsListingCard'
import IconInfoOutline from 'components/SvgIcons/InfoOutline/IconInfoOutline'

import Tooltip from 'components/tooltip'
import Table from 'components/Grid/Table'
import IconButton from 'components/Button/IconButton'
import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { putUserSetting } from 'models/user/put-user-setting'
import getUserTeams from 'actions/user/teams'

import TagsOverlay from '../../components/TagsOverlay'
import NoSearchResults from '../../../../../Partials/no-search-results'

import MergeContacts from '../Actions/MergeContacts'
import ExportContacts from '../Actions/ExportContactsButton'
import TagContacts from '../Actions/TagContacts'
import CreateEvent from '../Actions/CreateEvent'

import { ActionWrapper } from './components/ActionWrapper'
import { LoadingComponent } from './components/LoadingComponent'

import Menu from './columns/Menu'
import Name from './columns/Name'
import TagsString from './columns/Tags'
import { Contact } from './columns/Contact'
import { LastTouchedCell } from './columns/LastTouched'

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
      verticalAlign: 'center',
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
      header: () => (
        <React.Fragment>
          Last Touch
          <Tooltip
            placement="bottom"
            caption="This shows the last time you were in touch with a contact. Save events to keep it updated."
          >
            <IconLastTouch />
          </Tooltip>
        </React.Fragment>
      ),
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
      verticalAlign: 'center',
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
          conditionOperator={this.props.conditionOperator}
          users={this.props.users}
          exportIds={selectedRows}
          disabled={this.props.isFetching}
        />
      )
    },
    {
      render: ({ selectedRows }) => {
        const disabled = selectedRows.length === 0

        return (
          <ActionWrapper action="marketing" disabled={disabled}>
            <SendMlsListingCard disabled={disabled} selectedRows={selectedRows}>
              Marketing
            </SendMlsListingCard>
          </ActionWrapper>
        )
      }
    },
    {
      render: ({ selectedRows, resetSelectedRows }) => {
        const disabled = selectedRows.length === 0

        return (
          <ActionWrapper action="tagging" disabled={disabled}>
            <TagContacts
              disabled={disabled}
              selectedRows={selectedRows}
              resetSelectedRows={resetSelectedRows}
              handleChangeContactsAttributes={
                this.props.handleChangeContactsAttributes
              }
            />
          </ActionWrapper>
        )
      }
    },
    {
      render: ({ selectedRows, resetSelectedRows }) => {
        const disabled = selectedRows.length === 0

        return (
          <ActionWrapper action="creating an event" disabled={disabled}>
            <CreateEvent
              disabled={disabled}
              selectedRows={selectedRows}
              submitCallback={async () => {
                resetSelectedRows()
                await this.props.bulkEventCreationCallback()
              }}
            />
          </ActionWrapper>
        )
      }
    },
    {
      render: ({ selectedRows, resetSelectedRows }) => {
        const disabled = selectedRows.length < 2

        return (
          <ActionWrapper action="merging" atLeast="two" disabled={disabled}>
            <MergeContacts
              disabled={disabled}
              selectedRows={selectedRows}
              rowsUpdating={this.props.rowsUpdating}
              resetSelectedRows={resetSelectedRows}
            />
          </ActionWrapper>
        )
      }
    },
    {
      render: rowData => {
        const disabled = rowData.selectedRows.length === 0

        return (
          <ActionWrapper action="delete" disabled={disabled}>
            <IconButton
              disabled={disabled}
              size="small"
              appearance="outline"
              onClick={e => this.props.onRequestDelete(e, rowData)}
            >
              <IconDeleteOutline size={24} />
            </IconButton>
          </ActionWrapper>
        )
      }
    }
  ]

  sortableColumns = [
    { label: 'Most Recent', value: '-updated_at' },
    { label: 'Last Touch', value: 'last_touch' },
    { label: 'First name A-Z', value: 'display_name' },
    { label: 'First name Z-A', value: '-display_name' },
    { label: 'Last name A-Z', value: 'sort_field' },
    { label: 'Last name Z-A', value: '-sort_field' },
    { label: 'Created At', value: 'created_at' }
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
              columns: this.sortableColumns,
              onChange: this.props.handleChangeOrder,
              onPostChange: async item => {
                await putUserSetting(SORT_FIELD_SETTING_KEY, item.value)
                await this.props.getUserTeams(this.props.user)
              },
              defaultIndex:
                this.sortableColumns.find(
                  ({ value }) => value === this.props.sortBy
                ) || this.sortableColumns[0]
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
          handleChangeContactsAttributes={
            this.props.handleChangeContactsAttributes
          }
        />
      </div>
    )
  }
}

export default connect(
  ({ user }) => ({ user }),
  { getUserTeams }
)(ContactsList)
