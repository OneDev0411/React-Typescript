import React from 'react'
import { connect } from 'react-redux'
import { withRouter, browserHistory } from 'react-router'

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
  clearContactSearchResult,
  toggleRow,
  toggleAllRows
} from '../../../../../store_actions/contacts'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from '../../../../../views/components/SlideMenu'

import SavedSegments from '../../../../../views/components/Grid/SavedSegments/List'

import { Header } from './Header'
// import { Search } from './Search'
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
    isDeleting: false,
    isSideMenuOpen: true
  }

  componentDidMount() {
    this.onPageChange(this.props.currentPage, this.props.filter)
  }

  componentWillReceiveProps(nextProps) {
    // For fixing web#1318
    if (
      nextProps.currentPage == 1 &&
      this.props.currentPage != nextProps.currentPage
    ) {
      const page = selectPage(this.props.list, nextProps.currentPage)

      if (!page) {
        this.onPageChange(nextProps.currentPage)
      }
    }
  }

  handleOnDelete = (event, selectedRows) => {
    event.stopPropagation()

    const selectedRowsLength = selectedRows.length

    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: `Delete ${selectedRowsLength > 1 ? 'contacts' : 'contact'}`,
      onConfirm: () => this.handleDeleteContact(selectedRows),
      description: `Are you sure you want to delete ${
        selectedRowsLength > 1
          ? `these ${selectedRowsLength} contacts`
          : 'this contact'
      }?`
    })
  }

  handleDeleteContact = async ids => {
    try {
      this.setState({ isDeleting: true })
      await this.props.deleteContacts(ids)
      this.setState({ isDeleting: false })
    } catch (error) {
      console.log(error)
    }
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

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

  fetchPage = async page => {
    this.props.getContacts(page)
  }

  onPageChange = (page, filter) => {
    const { list } = this.props
    const listInfo = selectContactsInfo(list)

    if (!selectPage(list, page)) {
      if (filter || listInfo.type === 'filter') {
        return this.search(this.state.filter, page)
      }

      this.fetchPage(page)
    } else {
      this.props.setContactCurrentPage(page)
    }

    let url = `${BASE_URL}`

    if (page > 1) {
      url = `${BASE_URL}/page/${page}`
    }

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
    const { isSideMenuOpen } = this.state
    const { user, list, currentPage } = this.props

    const contacts = selectPageContacts(list, currentPage)
    const listInfo = selectContactsInfo(list)
    const currentPageData = selectPage(list, currentPage)
    const selectedRows = currentPageData ? currentPageData.selectedIds : []

    const isFetching =
      (currentPageData && currentPageData.fetching) ||
      selectContactsListFetching(list)

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

          <div style={{ padding: '0 1em' }}>
            {/* <Search
              disabled={noContact}
              inputValue={this.state.filter}
              isSearching={this.state.isSearching}
              handleOnChange={this.search}
            /> */}

            <Toolbar
              disabled={noContact || isFetching || this.state.isSearching}
              onDelete={this.handleOnDelete}
              deleting={this.state.isDeleting}
              selectedRows={selectedRows}
              totalCount={listInfo.total}
              pageSize={currentPageData ? currentPageData.ids.length : 0}
            />
            {noContact ? (
              <NoContact user={user} />
            ) : (
              <Table
                data={contacts}
                deleting={this.state.isDeleting}
                handleOnDelete={this.handleOnDelete}
                loading={isFetching}
                onPageChange={this.onPageChange}
                currentPage={currentPage}
                pages={this.getPages()}
                selectedRows={selectedRows}
                totalCount={listInfo.total}
                toggleRow={this.props.toggleRow}
                toggleAllRows={this.props.toggleAllRows}
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
  const currentPage = Number(props.params.page) || 1
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
    setContactCurrentPage,
    toggleRow,
    toggleAllRows
  })(ContactsList)
)
