import React, { Fragment } from 'react'
import ReactTable from 'react-table'

import { goTo } from '../../../../../../utils/go-to'
import { LoadingComponent } from './components/LoadingComponent'
import NoSearchResults from '../../../../../Partials/no-search-results'
import Radio from '../../../../../../views/components/radio/RadioWithState'
import { Pagination } from './components/Pagination'
import TrComponent from './components/Trcomponent'
import DropDown from './columns/Dropdown'
import TagsString from './columns/Tags'
import { LastTouchedCell } from './columns/LastTouched'
import Name from './columns/Name'
import { getAttributeFromSummary } from '../../../../../../models/contacts/helpers'
import TagsOverlay from '../../components/TagsOverlay'

function openContact(id) {
  goTo(`/dashboard/contacts/${id}`, 'All Contacts')
}

class ContactsList extends React.Component {
  state = { selectedTagContact: [] }

  onSelectTagContact = selectedTagContact =>
    this.setState({ selectedTagContact: [selectedTagContact] })

  closeTagsOverlay = () => this.setState({ selectedTagContact: [] })

  columns = [
    {
      id: 'td-select',
      headerClassName: 'select-row-header',
      Header: () => (
        <Radio
          square
          selected={
            this.props.data.length > 0 &&
            this.props.data.length === this.props.selectedRows.length
          }
          onClick={() => this.props.toggleAllRows(this.props.currentPage)}
        />
      ),
      accessor: '',
      width: 40,
      sortable: false,
      Cell: ({ original: contact }) => (
        <Radio
          square
          className="select-row"
          selected={!!this.props.selectedRows.includes(contact.id)}
          onClick={e => {
            e.stopPropagation()
            this.props.toggleRow(this.props.currentPage, contact.id)
          }}
        />
      )
    },
    {
      Header: 'NAME',
      id: 'name',
      sortable: false,
      accessor: contact => getAttributeFromSummary(contact, 'display_name'),
      Cell: ({ original: contact }) => <Name contact={contact} />
    },
    {
      Header: 'EMAIL',
      id: 'email',
      sortable: false,
      accessor: contact => getAttributeFromSummary(contact, 'email')
    },
    {
      Header: 'PHONE',
      id: 'phone',
      sortable: false,
      accessor: contact => getAttributeFromSummary(contact, 'phone_number')
    },
    {
      Header: 'Last Touched',
      id: 'last_touched',
      sortable: false,
      Cell: row => <LastTouchedCell contact={row.original} />
    },
    {
      Header: 'TAGS',
      id: 'tag',
      sortable: false,
      Cell: ({ original: contact }) => (
        <TagsString
          contact={contact}
          onSelectTagContact={this.onSelectTagContact}
        />
      )
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
          getTrProps={(state, { original: { id } }) => {
            if (this.props.deleting && this.props.selectedRows.includes(id)) {
              return {
                style: {
                  opacity: 0.5,
                  ponterEvents: 'none'
                }
              }
            }

            return {
              onClick: () => openContact(id)
            }
          }}
        />
        <TagsOverlay
          selectedContactsIds={this.state.selectedTagContact}
          isOpen={this.state.selectedTagContact.length > 0}
          closeOverlay={this.closeTagsOverlay}
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
