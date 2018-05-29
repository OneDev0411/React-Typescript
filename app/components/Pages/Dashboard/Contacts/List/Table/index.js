import React, { Fragment } from 'react'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'

import { LoadingComponent } from './components/LoadingComponent'
import NoSearchResults from '../../../../../Partials/no-search-results'
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

  render() {
    const defaultPageSize = 50
    const { pageSize } = this.state
    const {
      data,
      deletingContacts,
      loading,
      onPageChange,
      page,
      pages,
      totalCount
    } = this.props

    return (
      <ReactTable
        data={data}
        loading={loading}
        columns={this.columns}
        totalCount={totalCount}
        minRows={0}
        page={page}
        pages={pages}
        pageSize={pageSize}
        defaultPageSize={defaultPageSize}
        pageSizeOptions={[25, 50, 100]}
        showPaginationBottom
        onPageChange={onPageChange}
        onFetchData={this.fetchPage}
        showPagination={defaultPageSize < data.length}
        onPageSizeChange={this.setPageSize}
        PaginationComponent={Pagination}
        TdComponent={TrComponent}
        LoadingComponent={LoadingComponent}
        NoDataComponent={() =>
          loading ? null : (
            <NoSearchResults description="Try typing another name, email, phone or tag." />
          )
        }
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
