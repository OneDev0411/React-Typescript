import React, { Fragment } from 'react'
import _ from 'underscore'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'
import Radio from '../../../../../views/components/radio/RadioWithState'
import TrComponent from './Trcomponent'
import DropDown from './columns/Dropdown'
import TagsString from './columns/Tags'
import Name from './columns/Name'
import {
  getAttributeFromSummary,
  getContactTags
} from '../../../../../models/contacts/helpers'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

class ContactsList extends React.Component {
  shouldComponentUpdate(nextProps) {
    const filteredContactsChanged = !_.isEqual(
      nextProps.filteredContacts,
      this.props.filteredContacts
    )
    const deletingContactsChanged =
      nextProps.deletingContacts.length !== this.props.deletingContacts.length

    return filteredContactsChanged || deletingContactsChanged
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
      Cell: ({ original: contact }) => (
        <TagsString tags={getContactTags(contact)} />
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
    const { filteredContacts, deletingContacts } = this.props

    return (
      <ReactTable
        className="contacts-list-table"
        pageSize={Object.keys(filteredContacts).length}
        showPaginationBottom={false}
        data={filteredContacts}
        columns={this.columns}
        TdComponent={TrComponent}
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
