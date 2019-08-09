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
import { getUserTeams } from 'actions/user/teams'

import TagsOverlay from '../../components/TagsOverlay'
import NoSearchResults from '../../../../../Partials/no-search-results'

import MergeContacts from '../Actions/MergeContacts'
import ExportContacts from '../Actions/ExportContactsButton'
import TagContacts from '../Actions/TagContacts'
import CreateEvent from '../Actions/CreateEvent'
import AddToFlowAction from '../Actions/AddToFlow'

import { ActionWrapper } from './components/ActionWrapper'
import { LoadingComponent } from './components/LoadingComponent'

import Menu from './columns/Menu'
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
      render: ({ rowData: contact }) => <LastTouched contact={contact} />
    },
    {
      header: 'Flows',
      id: 'flows',
      sortable: false,
      render: ({ rowData: contact }) => (
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
      render: ({ excludedRows, selectedRows }) => {
        const { filters } = this.props

        return (
          <ExportContacts
            excludedRows={excludedRows}
            exportIds={selectedRows}
            filters={filters.attributeFilters}
            flows={filters.flows}
            crmTasks={filters.crm_tasks}
            searchText={filters.text}
            conditionOperator={filters.filter_type}
            users={filters.users}
            disabled={this.props.isFetching}
          />
        )
      }
    },
    {
      render: ({ entireMode, selectedRows }) => {
        const disabled = entireMode ? true : selectedRows.length === 0

        return (
          <ActionWrapper
            bulkMode={entireMode}
            action="marketing"
            disabled={disabled}
          >
            <SendMlsListingCard disabled={disabled} selectedRows={selectedRows}>
              Marketing
            </SendMlsListingCard>
          </ActionWrapper>
        )
      }
    },
    {
      render: ({
        entireMode,
        totalRowsCount,
        excludedRows,
        selectedRows,
        resetSelectedRows
      }) => {
        const { filters } = this.props
        const disabled = entireMode ? false : selectedRows.length === 0

        return (
          <ActionWrapper action="tagging" disabled={disabled}>
            <TagContacts
              disabled={disabled}
              entireMode={entireMode}
              totalRowsCount={totalRowsCount}
              excludedRows={excludedRows}
              selectedRows={selectedRows}
              filters={filters.attributeFilters}
              searchText={filters.query}
              conditionOperator={filters.filter_type}
              users={filters.users}
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
      render: ({ entireMode, selectedRows, resetSelectedRows }) => {
        const disabled = entireMode ? true : selectedRows.length === 0

        return (
          <ActionWrapper
            bulkMode={entireMode}
            action="creating an event"
            disabled={disabled}
          >
            <CreateEvent
              disabled={disabled}
              selectedRows={selectedRows}
              submitCallback={async () => {
                resetSelectedRows()
                await this.props.reloadContacts()
              }}
            />
          </ActionWrapper>
        )
      }
    },
    {
      render: ({
        entireMode,
        selectedRows,
        excludedRows,
        resetSelectedRows
      }) => (
        <AddToFlowAction
          entireMode={entireMode}
          excludedRows={excludedRows}
          selectedRows={selectedRows}
          filters={this.props.filters}
          resetSelectedRows={resetSelectedRows}
          reloadContacts={this.props.reloadContacts}
        />
      )
    },
    {
      render: ({ entireMode, selectedRows, resetSelectedRows }) => {
        const disabled = entireMode ? true : selectedRows.length < 2

        return (
          <ActionWrapper
            bulkMode={entireMode}
            action="merging"
            atLeast="two"
            disabled={disabled}
          >
            <MergeContacts
              disabled={disabled}
              selectedRows={selectedRows}
              submitCallback={async () => {
                resetSelectedRows()
                await this.props.reloadContacts()
              }}
            />
          </ActionWrapper>
        )
      }
    },
    {
      render: data => {
        const disabled = data.entireMode
          ? false
          : data.selectedRows.length === 0

        return (
          <ActionWrapper action="delete" disabled={disabled}>
            <IconButton
              disabled={disabled}
              size="small"
              appearance="outline"
              onClick={e => this.props.onRequestDelete(e, data)}
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
    { label: 'Last Touch', value: '-last_touch' },
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
    const { props, state } = this

    return (
      <div>
        <Table
          plugins={{
            selectable: {
              persistent: true,
              allowSelectEntireList: true,
              storageKey: 'contacts',
              entityName: 'Contacts'
            },
            loadable: {
              accuracy: 300, // px
              accuracyTop: 600, // px
              debounceTime: 300, // ms
              container: props.tableContainerId,
              onScrollBottom: props.onRequestLoadMore,
              onScrollTop: props.onRequestLoadMoreBefore
            },
            actionable: {
              actions: this.actions
            },
            sortable: {
              columns: this.sortableColumns,
              defaultIndex: props.order,
              onChange: props.handleChangeOrder,
              onPostChange: async item => {
                await putUserSetting(SORT_FIELD_SETTING_KEY, item.value)
                await props.dispatch(getUserTeams(props.user))
              }
            }
          }}
          data={props.data}
          summary={{
            entityName: 'Contacts',
            total: props.listInfo.total || 0
          }}
          isFetching={props.isFetching}
          isFetchingMore={props.isFetchingMore}
          isFetchingMoreBefore={props.isFetchingMoreBefore}
          columns={this.columns}
          LoadingState={LoadingComponent}
          getTrProps={this.getGridTrProps}
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
