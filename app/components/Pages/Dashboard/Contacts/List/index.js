import React, { Fragment } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { confirmation } from '../../../../../store_actions/confirmation'
import Contact from '../../../../../models/contacts'
import styled from 'styled-components'
import {
  selectContacts,
  isFetchingContactsList
} from '../../../../../reducers/contacts/list'
import { deleteContacts } from '../../../../../store_actions/contacts'

import Header from './header'
import ExportContacts from './ExportContacts'

import NoContact from './no-contact'
import Loading from '../../../../Partials/Loading'
import { Container } from '../components/Container'
import NoSearchResults from '../../../../Partials/no-search-results'
import Table from './Table'

function openContact(id) {
  browserHistory.push(`/dashboard/contacts/${id}`)
}

const SecondHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 2rem;
`
const SecondHeaderText = styled.p`
  font-size: 17px;
  margin-bottom: 0;
  margin-right: 8px;
`
const CustomLoading = styled(Loading)`
  position: absolute !important;
  left: 50%;
  margin: auto !important;
`

class ContactsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: '',
      deletingContacts: [],
      selectedRows: {}
    }

    this.handleOnDelete = this.handleOnDelete.bind(this)
  }

  handleOnDelete(event, contactIds) {
    event.stopPropagation()

    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: `Delete ${contactIds.length > 1 ? 'contacts' : 'contact'}`,
      onConfirm: () => this.handleDeleteContact({ contactIds }),
      description: `Are you sure you want to delete ${
        contactIds.length > 1 ? 'these contacts' : 'this contact'
      }?`
    })
  }

  async handleDeleteContact({ contactIds }) {
    this.setState({ deletingContacts: contactIds })

    const { deleteContacts } = this.props

    await deleteContacts(contactIds)
    this.setState({ deletingContacts: [], selectedRows: [] })
  }

  onInputChange = filter => this.setState({ filter })

  applyFilters = contact => {
    let matched = false
    const { filter } = this.state
    let regex = new RegExp(
      // / First reomoving some charater that break the regex
      filter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'),
      'i'
    )

    if (regex.test(Contact.get.name(contact))) {
      matched = true
    }

    if (!matched && Object.keys(Contact.get.emails(contact)).length !== 0) {
      matched = _.some(Contact.get.emails(contact), item =>
        regex.test(item.email)
      )
    }

    if (!matched && Object.keys(Contact.get.phones(contact)).length !== 0) {
      matched = _.some(Contact.get.phones(contact), item =>
        item.phone_number.includes(filter)
      )
    }

    if (!matched && Object.keys(Contact.get.tags(contact)).length !== 0) {
      matched = _.some(Contact.get.tags(contact), item => regex.test(item.tag))
    }

    return matched
  }

  toggleSelectedRow = contact => {
    const { selectedRows } = this.state
    let newSelectedRows = {}

    if (selectedRows[contact.id]) {
      newSelectedRows = _.omit(selectedRows, row => row.id === contact.id)
    } else {
      newSelectedRows = {
        ...selectedRows,
        [contact.id]: contact
      }
    }

    this.setState({ selectedRows: newSelectedRows })
  }
  render() {
    const { deletingContacts, selectedRows } = this.state
    const { user, isFetching, contactsList, loadingImport } = this.props
    const contactsCount = contactsList.length

    if (isFetching && contactsCount === 0) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    if (contactsCount === 0) {
      return (
        <div className="list">
          <NoContact
            user={user}
            contactsCount={contactsCount}
            onNewContact={id => openContact(id)}
          />
        </div>
      )
    }

    const filteredContacts = contactsList.filter(contact =>
      this.applyFilters(contact)
    )
    const selectedRowsLength = Object.keys(selectedRows).length

    return (
      <div className="list">
        <Header
          user={user}
          contactsCount={contactsCount}
          onNewContact={id => openContact(id)}
          onInputChange={this.onInputChange}
        />
        {loadingImport && (
          <i className="fa fa-spinner fa-pulse fa-fw fa-3x spinner__loading" />
        )}
        {_.size(filteredContacts) === 0 ? (
          <NoSearchResults description="Try typing another name, email, phone or tag." />
        ) : (
          <Fragment>
            <SecondHeader>
              <SecondHeaderText>
                {selectedRowsLength > 0 ? `${selectedRowsLength} of ` : ''}
                {`${filteredContacts.length} Contacts`}
              </SecondHeaderText>
              <ExportContacts selectedRows={selectedRows} />
              {selectedRowsLength > 0 && (
                <div className="list--secondary-button">
                  <button
                    className="button c-button--shadow"
                    onClick={event =>
                      this.handleOnDelete(event, Object.keys(selectedRows))
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </SecondHeader>
            {isFetching && <CustomLoading />}

            <Table
              filteredContacts={filteredContacts}
              toggleSelectedRow={this.toggleSelectedRow}
              handleOnDelete={this.handleOnDelete}
              deletingContacts={deletingContacts}
              selectedRows={selectedRows}
            />
          </Fragment>
        )}
      </div>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { list, spinner: loadingImport } = contacts
  const contactsList = selectContacts(list)
  const isFetching = isFetchingContactsList(list)

  return {
    user,
    isFetching,
    contactsList,
    loadingImport
  }
}

export default connect(mapStateToProps, {
  confirmation,
  deleteContacts
})(ContactsList)
