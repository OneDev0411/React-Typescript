import React, { Fragment } from 'react'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'

import { LoadingComponent } from './components/LoadingComponent'
import NoSearchResults from '../../../../../Partials/no-search-results'
import Radio from '../../../../../../views/components/radio/RadioWithState'
import { Pagination } from './components/Pagination'
import TrComponent from './components/Trcomponent'
import DropDown from './columns/Dropdown'
import TagsString from './columns/Tags'
import Name from './columns/Name'
import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

class ContactsList extends React.Component {
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
      headerClassName: 'select-row-header',
      Header: () => (
        <Radio
          square
          selected={
            this.props.data.length > 0 &&
            this.props.data.length === _.size(this.props.selectedRows)
          }
          onClick={() => this.props.toggleSelectedAllRows()}
        />
      ),
      accessor: '',
      width: 40,
      sortable: false,
      Cell: ({ original: contact }) => (
        <Radio
          square
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

  render() {
    const { loading } = this.props

    return (
      <Fragment>
        <ReactTable
          data={this.props.data}
          loading={loading}
          columns={this.columns}
          totalCount={this.props.totalCount}
          minRows={0}
          page={0}
          currentPage={this.props.currentPage}
          pages={this.props.pages}
          defaultPageSize={50}
          showPagination={false}
          onPageChange={this.props.onPageChange}
          TdComponent={TrComponent}
          LoadingComponent={LoadingComponent}
          NoDataComponent={() =>
            loading ? null : (
              <NoSearchResults description="Try typing another name, email, phone or tag." />
            )
          }
          className="contacts-list-table"
          getTrProps={(state, { original: { id: contactId } }) => {
            if (this.props.deletingContacts.includes(contactId)) {
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

        {!loading &&
          this.props.pages > 1 &&
          this.props.data.length > 0 && (
            <Pagination pageSize={50} {...this.props} />
          )}
      </Fragment>
    )
  }
}

export default ContactsList
