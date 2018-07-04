import React from 'react'
import { connect } from 'react-redux'
import { withRouter, browserHistory } from 'react-router'

import { confirmation } from '../../../../../store_actions/confirmation'

import {
  selectContactsInfo,
  selectPage,
  selectPageContacts,
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
import { Search } from './Search'
import { Toolbar } from './Toolbar'

import Table from './Table'
import { NoContact } from './NoContact'
import ContactFilters from './Filters'

const BASE_URL = '/dashboard/contacts'
const deletedState = {
  deletingContacts: [],
  selectedRows: {},
  searchInputValue: ''
}

class ContactsList extends React.Component {
  state = {
    filter: this.props.filter,
    searchInputValue: '',
    pageTitle: 'All Contacts',
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

  onFilterChange = async (filter, page = 1) => {
    const { searchInputValue } = this.state

    try {
      let nextState = { filter, isSearching: true, searchInputValue }

      if (filter && filter !== selectContactsInfo(this.props.list).filter) {
        nextState = { ...nextState, ...deletedState }
      }

      this.setState(nextState, () =>
        // browserHistory.push(`${BASE_URL}/page/${page}?filter=${filter}`)
        browserHistory.push(`${BASE_URL}/page/${page}`)
      )

      await this.props.searchContacts(
        filter,
        page,
        undefined,
        nextState.searchInputValue
      )
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ isSearching: false })
    }
  }

  search = searchInputValue =>
    this.setState({ ...deletedState, searchInputValue }, () => {
      this.onFilterChange(this.state.filter)
    })

  fetchPage = async page => {
    this.props.getContacts(page)
  }

  onPageChange = (page, filter) => {
    const { list } = this.props
    const listInfo = selectContactsInfo(list)

    if (!selectPage(list, page)) {
      if (filter || listInfo.type === 'filter') {
        return this.onFilterChange(this.state.filter, page)
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

  handleChangeSavedSegment = segment => {
    this.onFilterChange(segment.filters)

    this.setState({
      pageTitle: segment.name
    })
  }

  render() {
    const {
      isSideMenuOpen,
      pageTitle,
      filter,
      isSearching,
      searchInputValue
    } = this.state
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
            onChange={this.handleChangeSavedSegment}
          />
        </SideMenu>

        <PageContent>
          <Header
            title={pageTitle}
            isSideMenuOpen={isSideMenuOpen}
            user={user}
            onMenuTriggerChange={this.toggleSideMenu}
          />

          <ContactFilters onFilterChange={this.onFilterChange} />

          <div style={{ padding: '0 1em' }}>
            <Search
              disabled={noContact}
              inputValue={searchInputValue}
              isSearching={isSearching}
              handleOnChange={this.search}
            />

            <Toolbar
              disabled={noContact || isFetching || isSearching}
              onDelete={this.handleOnDelete}
              deleting={this.state.isDeleting}
              selectedRows={selectedRows}
              filters={filter}
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
  connect(
    mapStateToProps,
    {
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
    }
  )(ContactsList)
)
