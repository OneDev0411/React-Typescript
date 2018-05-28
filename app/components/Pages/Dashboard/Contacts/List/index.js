import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { confirmation } from '../../../../../store_actions/confirmation'

import {
  selectContacts,
  selectContactsInfo,
  selectContactsPage,
  selectContactsPages,
  isFetchingContactsList
} from '../../../../../reducers/contacts/list'
import {
  getContacts,
  searchContacts,
  deleteContacts,
  clearContactSearchResult
} from '../../../../../store_actions/contacts'

import { Header } from './Header'
import { Filters } from './Filters'
import { Toolbar } from './Toolbar'

import Table from './Table'
import { NoContact } from './NoContact'

class ContactsList extends React.Component {
  state = {
    page: 0,
    filter: selectContactsInfo(this.props.list).filter,
    isSearching: false,
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
    try {
      const { page } = this.state
      const { deleteContacts } = this.props
      const deletedState = { deletingContacts: [], selectedRows: {} }

      this.setState({ deletingContacts: contactIds })

      await deleteContacts(contactIds)

      const currentPage = selectContactsPage(this.props.list, page)

      if (currentPage && currentPage.ids.length === contactIds.length) {
        return this.setState({
          ...deletedState,
          page: page > 0 ? 0 : page - 1
        })
      }

      this.setState(deletedState)
    } catch (error) {
      console.log(error)
    }
  }

  search = async (filter, page = 1) => {
    if (filter.length === 0) {
      return this.setState(
        { filter: '', isSearching: false, page: 0 },
        this.props.clearContactSearchResult
      )
    }

    try {
      this.setState({ filter, isSearching: true })

      await this.props.searchContacts(filter, page)

      this.setState({ isSearching: false, page: page - 1 })
    } catch (error) {
      this.setState({ isSearching: false })
      throw error
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

  fetchPage = async page => {
    this.props.getContacts(page)
  }

  onPageChange = page => {
    this.setState({ page })

    if (!selectContactsPage(this.props.list, page + 1)) {
      if (selectContactsInfo(this.props.list).type === 'filter') {
        return this.search(this.state.filter, page + 1)
      }

      this.fetchPage(page + 1)
    }
  }

  render() {
    const { page, selectedRows } = this.state
    const { user, list } = this.props
    const contacts = selectContacts(list)
    const listInfo = selectContactsInfo(list)
    const pages = _.size(selectContactsPages(list))
    const isFetching = isFetchingContactsList(list)
    let { total: totalCount } = listInfo

    const noContact =
      (!isFetching && contacts.length === 0 && listInfo.type !== 'filter') ||
      _.size(this.props.attributeDefs.byName) === 0

    return (
      <Fragment>
        <Header user={user} />
        <div style={{ padding: '2rem' }}>
          <Filters
            disabled={noContact}
            inputValue={this.state.filter}
            isSearching={this.state.isSearching}
            handleOnChange={this.search}
          />
          <Toolbar
            disabled={noContact || isFetching || this.state.isSearching}
            onDelete={this.handleOnDelete}
            selectedRows={selectedRows}
            totalCount={totalCount}
          />
          {noContact ? (
            <NoContact user={user} />
          ) : (
            <Table
              data={contacts}
              deletingContacts={this.state.deletingContacts}
              handleOnDelete={this.handleOnDelete}
              loading={isFetching}
              onPageChange={this.onPageChange}
              page={page}
              pages={pages}
              selectedRows={selectedRows}
              totalCount={totalCount}
              toggleSelectedRow={this.toggleSelectedRow}
            />
          )}
        </div>
      </Fragment>
    )
  }
}

function mapStateToProps({ user, contacts }) {
  const { list, spinner: loadingImport, attributeDefs } = contacts

  return {
    user,
    list,
    loadingImport,
    attributeDefs
  }
}

export default connect(mapStateToProps, {
  clearContactSearchResult,
  confirmation,
  deleteContacts,
  getContacts,
  searchContacts
})(ContactsList)
