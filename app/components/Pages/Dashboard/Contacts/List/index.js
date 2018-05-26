import React, { Fragment } from 'react'
import _ from 'underscore'
import { connect } from 'react-redux'
import { confirmation } from '../../../../../store_actions/confirmation'
import styled from 'styled-components'

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
    filter: '',
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
      const deletedState = { deletingContacts: [], selectedRows: [] }

      this.setState({ deletingContacts: contactIds })

      await deleteContacts(contactIds)

      const currentPageIdsLength = selectContactsPage(this.props.list, page).ids
        .length

      if (currentPageIdsLength === contactIds.length) {
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
        { filter: '', isSearching: false },
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
      if (selectContactsInfo(this.props.list).type === 'search') {
        return this.search(this.state.filter, page + 1)
      }

      this.fetchPage(page + 1)
    }
  }

  render() {
    const { page, isSearching, deletingContacts, selectedRows } = this.state
    const { user, list, loadingImport, attributeDefs } = this.props
    const contacts = selectContacts(list)
    const listInfo = selectContactsInfo(list)
    const pages = _.size(selectContactsPages(list))
    const isFetching = isFetchingContactsList(list)
    let { total: totalCount } = listInfo

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

    if (contacts.length === 0 && listInfo.type === 'general') {
      return (
        <div className="list">
          <NoContact user={user} />
        </div>
      )
    }

    const selectedRowsLength = _.size(selectedRows)

    return (
      <div className="list">
        <Header
          filter={this.state.filter}
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
              {`${totalCount.toLocaleString()} Contacts`}
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
            data={contacts}
            deletingContacts={deletingContacts}
            handleOnDelete={this.handleOnDelete}
            loading={isFetching}
            onPageChange={this.onPageChange}
            page={page}
            pages={pages}
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
