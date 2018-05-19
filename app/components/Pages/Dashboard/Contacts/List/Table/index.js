import React, { Fragment } from 'react'
import _ from 'underscore'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'

import './style.scss'

import Radio from '../../../../../../views/components/radio/RadioWithState'
import Pagination from './components/Pagination'
import TrComponent from './components/Trcomponent'
import DropDown from './columns/Dropdown'
import TagsString from './columns/Tags'
import Name from './columns/Name'
import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

class ContactsList extends React.Component {
  state = {
    page: 0,
    pageSize: 50
  }

  getCellTitle = title => (
    <Fragment>
      {title}
      <i className="fa fa-caret-down" />
      <i className="fa fa-caret-up" />
    </Fragment>
  )
  columns = [
    {
      id: 'td-select',
      accessor: '',
      width: 40,
      sortable: false,
      Cell: ({ original: contact }) => (
        <Radio
          className="select-row"
          selected={!!this.props.selectedRows[contact.id]}
          onClick={e => {
            e.stopPropagation()
            this.props.toggleSelectedRow(contact)
          }}
        />
      )
    },
    {
      Header: this.getCellTitle('NAME'),
      id: 'name',
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      Cell: ({ original: contact }) => <Name contact={contact} />
    },
    {
      Header: this.getCellTitle('EMAIL'),
      id: 'email',
      accessor: contact => getAttributeFromSummary(contact, 'email')
    },
    {
      Header: 'PHONE',
      id: 'phone',
      accessor: contact => getAttributeFromSummary(contact, 'phone_number')
    },
    {
      Header: this.getCellTitle('TAGS'),
      id: 'tag',
      Cell: ({ original: contact }) => <TagsString contact={contact} />
    },
    {
      id: 'td-delete',
      Header: '',
      accessor: '',
      className: 'td--dropdown-container',
      width: 30,
      Cell: ({ original: contact }) => {
        const { id: contactId } = contact

        return (
          <DropDown
            contactId={contactId}
            handleOnDelete={this.props.handleOnDelete}
          />
        )
      }
    }
  ]

  setPageSize = pageSize => {
    this.setState({
      pageSize
    })
  }

  setPage = page => {
    this.setState({ page })
  }

  render() {
    const defaultPageSize = 50
    const { pageSize, page } = this.state
    const { filteredContacts, deletingContacts, listInfo } = this.props

    return (
      <ReactTable
        listInfo={listInfo}
        data={filteredContacts}
        columns={this.columns}
        TdComponent={TrComponent}
        minRows={0}
        page={page}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        pageSizeOptions={[25, 50, 100]}
        showPaginationBottom
        onPageChange={this.setPage}
        onFetchData={this.fetchPage}
        showPagination={defaultPageSize < listInfo.total}
        onPageSizeChange={this.setPageSize}
        PaginationComponent={Pagination}
        className="contacts-list-table"
        getTrProps={(state, { original: { id: contactId } }) => {
          if (deletingContacts.includes(contactId)) {
            return {
              style: {
                opacity: 0.5,
                ponterEvents: 'none'
              }
            }
          }

          return {
            onClick: () => openContact(contactId)
          }
        }}
      />
    )
  }
}

export default ContactsList
