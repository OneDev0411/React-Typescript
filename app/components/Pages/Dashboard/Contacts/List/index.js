import React from 'react'
import { connect } from 'react-redux'
import { withRouter, browserHistory } from 'react-router'
import _ from 'underscore'

import { confirmation } from '../../../../../store_actions/confirmation'

import {
  selectContactsInfo,
  selectPage,
  selectPageContacts,
  selectCurrentPage,
  selectContactsListFetching
} from '../../../../../reducers/contacts/list'

import {
  getContacts,
  searchContacts,
  deleteContacts,
  removeContactPage,
  receiveContactPage,
  setContactCurrentPage,
  clearContactSearchResult
} from '../../../../../store_actions/contacts'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from '../../../../../views/components/SlideMenu'

import SavedSegments from '../../../../../views/components/Grid/SavedSegments/List'

import { Header } from './Header'
import { Search } from './Search'
import { Toolbar } from './Toolbar'

import Table from './Table'
import { NoContact } from './NoContact'
import ContactFilters from './Filters'

const BASE_URL = '/dashboard/contacts'
const deletedState = { deletingContacts: [], selectedRows: {} }

class ContactsList extends React.Component {
  state = {
    filter: this.props.filter,
    isSearching: false,
    isSideMenuOpen: true,
    deletingContacts: [],
    selectedRows: {}
  }

  componentDidMount() {
    const page = (this.props.params.page && Number(this.props.params.page)) || 1

    if (this.props.filter) {
      return this.search(this.props.filter, page)
    }

    if (page > 1) {
      browserHistory.push(`${BASE_URL}/page/${page}`)
    }

    this.fetchPage(page)
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
      this.setState({ deletingContacts: contactIds })

      await this.props.deleteContacts(contactIds)

      this.setState(deletedState)
    } catch (error) {
      console.log(error)
    }
  }

  toggleSideMenu = () =>
    this.setState({
      isSideMenuOpen: !this.state.isSideMenuOpen
    })

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

  search = async (filter, page = 1) => {
    if (typeof filter === 'string' && filter.length === 0) {
      return this.setState(
        { ...deletedState, filter: '', isSearching: false },
        () => {
          this.props.clearContactSearchResult()
          browserHistory.push(BASE_URL)
        }
      )
    }

    try {
      let nextState = { filter, isSearching: true }

      if (filter !== selectContactsInfo(this.props.list).filter) {
        nextState = { ...nextState, ...deletedState }
      }

      this.setState(nextState, () =>
        // browserHistory.push(`${BASE_URL}/page/${page}?filter=${filter}`)
        browserHistory.push(`${BASE_URL}/page/${page}`)
      )

      await this.props.searchContacts(filter, page)
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ isSearching: false })
    }
  }

  toggleSelectedAllRows = () => {
    const { selectedRows } = this.state
    const { list, currentPage } = this.props
    const contacts = selectPageContacts(list, currentPage)
    const shouldSelectAll = _.size(selectedRows) < contacts.length
    let newSelectedRows = {}

    if (shouldSelectAll) {
      contacts.forEach(contact => {
        newSelectedRows[contact.id] = contact
      })
    }

    this.setState({
      selectedRows: newSelectedRows
    })
  }

  deselectAllRows = () => {
    this.setState({
      selectedRows: {}
    })
  }
  fetchPage = async page => {
    this.props.getContacts(page)
  }

  onPageChange = page => {
    // Delesect on selected contacts on page change
    // https://gitlab.com/rechat/web/issues/1307#note_76362718
    this.deselectAllRows()

    const { list } = this.props
    const listInfo = selectContactsInfo(list)

    if (!selectPage(list, page)) {
      if (listInfo.type === 'filter') {
        return this.search(this.state.filter, page)
      }

      this.fetchPage(page)
    } else {
      this.props.setContactCurrentPage(page)
    }

    let url = `${BASE_URL}/page/${page}`

    if (listInfo.filter) {
      url = `${url}?filter=${listInfo.filter}`
    }

    browserHistory.push(url)
  }

  getPages = () => {
    const pageDefaultSize = 50
    const { total } = selectContactsInfo(this.props.list)

    if (total < pageDefaultSize) {
      return 0
    }

    return Math.ceil(total / pageDefaultSize)
  }

  render() {
    const { user, list, currentPage } = this.props
    const { selectedRows, isSideMenuOpen } = this.state
    const listInfo = selectContactsInfo(list)
    const page = selectPage(list, currentPage)
    const isFetching =
      (page && page.fetching) || selectContactsListFetching(list)
    const contacts = selectPageContacts(list, currentPage)

    const noContact =
      !isFetching && contacts.length === 0 && listInfo.type !== 'filter'

    return (
      <PageContainer>
        <SideMenu isOpen={isSideMenuOpen}>
          <SavedSegments
            name="contacts"
            onChange={segment => this.search(segment.filters)}
          />
        </SideMenu>

        <PageContent>
          <Header
            isSideMenuOpen={isSideMenuOpen}
            user={user}
            onMenuTriggerChange={this.toggleSideMenu}
          />

          <ContactFilters onFilterChange={this.search} />

          <div style={{ margin: '50px 20px' }}>
            {/* <Search
              disabled={noContact}
              inputValue={this.state.filter}
              isSearching={this.state.isSearching}
              handleOnChange={this.search}
            /> */}

            <Toolbar
              disabled={noContact || isFetching || this.state.isSearching}
              onDelete={this.handleOnDelete}
              selectedRows={selectedRows}
              totalCount={listInfo.total}
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
                currentPage={currentPage}
                pages={this.getPages(page)}
                selectedRows={selectedRows}
                totalCount={listInfo.total}
                toggleSelectedRow={this.toggleSelectedRow}
                toggleSelectedAllRows={this.toggleSelectedAllRows}
              />
            )}
          </div>
        </PageContent>
      </PageContainer>
    )
  }
}

function mapStateToProps(state, props) {
  const { list } = state.contacts
  const currentPage =
    (props.params.page && Number(props.params.page)) || selectCurrentPage(list)

  const filter =
    (props.location.query && props.location.query.filter) ||
    selectContactsInfo(list).filter ||
    ''

  return {
    currentPage,
    filter,
    list,
    user: state.user
  }
}

export default withRouter(
  connect(mapStateToProps, {
    clearContactSearchResult,
    confirmation,
    deleteContacts,
    getContacts,
    removeContactPage,
    receiveContactPage,
    searchContacts,
    setContactCurrentPage
  })(ContactsList)
)
