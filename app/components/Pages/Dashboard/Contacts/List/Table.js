import React, { Fragment } from 'react'
import _ from 'underscore'
import { browserHistory } from 'react-router'
import ReactTable from 'react-table'
import Radio from '../../../../../views/components/radio/RadioWithState'
import Contact from '../../../../../models/contacts'
import TrComponent from './Trcomponent'
import DropDown from './columns/Dropdown'
import TagsString from './columns/Tags'
import Name from './columns/Name'

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
      Header: () => (
        <Fragment>
          Name
          <i className="fa fa-caret-down" />
          <i className="fa fa-caret-up" />
        </Fragment>
      ),
      id: 'name',
      accessor: contact => Contact.get.name(contact),
      Cell: ({ original: contact }) => (
        <Name
          name={Contact.get.name(contact)}
          avatar={Contact.get.avatar(contact)}
        />
      )
    },
    {
      Header: () => (
        <Fragment>
          EMAIL
          <i className="fa fa-caret-down" />
          <i className="fa fa-caret-up" />
        </Fragment>
      ),
      id: 'email',
      accessor: contact => Contact.get.email(contact)
    },
    {
      Header: 'PHONE',
      id: 'phone',
      accessor: contact => Contact.get.phone(contact)
    },
    {
      Header: () => (
        <Fragment>
          TAGS
          <i className="fa fa-caret-down" />
          <i className="fa fa-caret-up" />
        </Fragment>
      ),
      id: 'tag',
      Cell: ({ original: contact }) => (
        <TagsString tags={Contact.get.tags(contact)} />
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
