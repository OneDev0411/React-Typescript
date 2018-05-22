import React, { Fragment } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { confirmation } from '../../../../../store_actions/confirmation'
import styled from 'styled-components'

import {
  selectContacts,
  getContactsinfo,
  isFetchingContactsList
} from '../../../../../reducers/contacts/list'
import { deleteContacts } from '../../../../../store_actions/contacts'
import { searchContacts } from '../../../../../models/contacts/search-contacts'

import Header from './header'
import ExportContacts from './ExportContacts'

import Table from './Table'
import NoContact from './no-contact'
import Loading from '../../../../Partials/Loading'
import { Container } from '../components/Container'

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

class ContactsList extends React.Component {
  state = {
    page: 0,
    isSearching: false,
    filteredContacts: null,
    deletingContacts: [],
    selectedRows: {}
  }

  handleOnDelete = (event, contactIds) => {
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

  handleDeleteContact = async ({ contactIds }) => {
    this.setState({ deletingContacts: contactIds })

    const { deleteContacts } = this.props

    await deleteContacts(contactIds)
    this.setState({ deletingContacts: [], selectedRows: [] })
  }

  search = async keyword => {
    if (keyword.length === 0) {
      return this.setState({ filteredContacts: null })
    }

    try {
      this.setState({ isSearching: true })

      const items = await searchContacts(keyword)

      this.setState({ filteredContacts: items, page: 0 })
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ isSearching: false, page: 0 })
    }
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

  onPageChange = page => {
    this.setState({ page })
  }

  render() {
    const {
      page,
      isSearching,
      filteredContacts,
      deletingContacts,
      selectedRows
    } = this.state
    const {
      user,
      listInfo,
      contacts,
      isFetching,
      loadingImport,
      attributeDefs
    } = this.props
    const data = filteredContacts || contacts
    let { total: totalCount } = listInfo

    if (filteredContacts != null) {
      totalCount = filteredContacts.length
    }

    if (
      (isFetching && contacts.length === 0) ||
      _.size(attributeDefs.byName) === 0
    ) {
      return (
        <Container>
          <Loading />
        </Container>
      )
    }

    if (contacts.length === 0) {
      return (
        <div className="list">
          <NoContact user={user} />
        </div>
      )
    }

    const selectedRowsLength = Object.keys(selectedRows).length

    return (
      <div className="list">
        <Header
          contactsCount={listInfo.total}
          isSearching={isSearching}
          onInputChange={this.search}
          user={user}
        />
        {loadingImport && (
          <i className="fa fa-spinner fa-pulse fa-fw fa-3x spinner__loading" />
        )}
        <Fragment>
          <SecondHeader>
            <SecondHeaderText>
              {selectedRowsLength > 0 ? `${selectedRowsLength} of ` : ''}
              {`${totalCount} Contacts`}
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

          <Table
            data={data}
            deletingContacts={deletingContacts}
            handleOnDelete={this.handleOnDelete}
            loading={isSearching}
            onPageChange={this.onPageChange}
            page={page}
            selectedRows={selectedRows}
            totalCount={totalCount}
            toggleSelectedRow={this.toggleSelectedRow}
          />
        </Fragment>
      </div>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { list, spinner: loadingImport, attributeDefs } = contacts

  return {
    user,
    loadingImport,
    attributeDefs,
    contacts: selectContacts(list),
    listInfo: getContactsinfo(list),
    isFetching: isFetchingContactsList(list)
  }
}

export default connect(mapStateToProps, {
  confirmation,
  deleteContacts
})(ContactsList)
