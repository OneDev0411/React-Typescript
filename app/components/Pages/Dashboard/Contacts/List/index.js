import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { confirmation } from '../../../../../store_actions/confirmation'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from '../../../../../views/components/SlideMenu'

import SavedSegments from '../../../../../views/components/Grid/SavedSegments/List'

import ContactFilters from './Filters'
import { Header } from './Header'
import { SearchContacts } from './Search'
import Table from './Table'

import { resetGridSelectedItems } from '../../../../../views/components/Grid/Table/Plugins/Selectable'

import {
  selectContacts,
  selectContactsInfo
} from '../../../../../reducers/contacts/list'

import {
  getContacts,
  searchContacts,
  deleteContacts
} from '../../../../../store_actions/contacts'

const GridContainer = styled.div`
  padding: 0 16px;
`

class ContactsList extends React.Component {
  state = {
    isSideMenuOpen: true,
    pageTitle: 'All Contacts',
    isFetchingContacts: false,
    isFetchingMoreContacts: false,
    isRowsUpdating: false,
    filter: this.props.filter,
    selectedRows: [],
    searchInputValue: this.props.searchInputValue
  }

  componentDidMount() {
    if (this.props.listInfo.count === 0) {
      this.fetchContacts()
    }
  }

  fetchContacts = async (start = 0) => {
    const { filter, searchInputValue } = this.state

    this.setState({ isFetchingContacts: true })

    if (start === 0) {
      this.resetSelectedRows()
    }

    try {
      if (this.hasSearchState()) {
        await this.handleFilterChange(filter, searchInputValue, start)
      } else {
        await this.props.getContacts(start)
      }
    } catch (e) {
      // todo
    }

    this.setState({ isFetchingContacts: false })
  }

  handleChangeSavedSegment = segment => {
    this.setState(
      {
        pageTitle: segment.name
      },
      () => {
        this.handleFilterChange(segment.filters, this.state.searchInputValue)
      }
    )
  }

  handleFilterChange = async (filter, searchInputValue, start = 0) => {
    this.setState({ isFetchingContacts: true, filter })

    if (start === 0) {
      this.resetSelectedRows()
    }

    try {
      await this.props.searchContacts(
        filter,
        start,
        undefined,
        searchInputValue
      )
    } catch (e) {
      // todo
    }

    this.setState({ isFetchingContacts: false })
  }

  handleSearch = value => {
    console.log(`[ Search ] ${value}`)
    this.setState({ searchInputValue: value })
    this.handleFilterChange(this.state.filter, value)
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  handleLoadMore = async () => {
    const { total } = this.props.listInfo
    const startFrom = this.props.list.ids.length

    if (this.state.isFetchingMoreContacts || startFrom === total) {
      return false
    }

    console.log(`[ Loading More ] Start: ${startFrom}`)

    this.setState({ isFetchingMoreContacts: true })

    if (this.hasSearchState()) {
      await this.fetchContacts(startFrom)
    } else {
      await this.handleFilterChange(
        this.state.filter,
        this.state.searchInputValue
      )
    }

    this.setState({ isFetchingMoreContacts: false })
  }

  onChangeSelectedRows = selectedRows =>
    this.setState({
      selectedRows
    })

  hasSearchState = () => this.state.filter || this.state.searchInputValue

  handleOnDelete = (e, { selectedRows }) => {
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
      this.rowsUpdating(true)
      this.setState({ isFetchingContacts: true })
      await this.props.deleteContacts(ids)

      this.rowsUpdating(false)
      this.setState({ isFetchingContacts: false })
      this.resetSelectedRows()
    } catch (error) {
      console.log(error)
    }
  }

  rowsUpdating = isRowsUpdating => this.setState({ isRowsUpdating })

  resetSelectedRows = () => {
    resetGridSelectedItems('contacts')
    this.setState({
      selectedRows: []
    })
  }

  render() {
    const { isSideMenuOpen } = this.state
    const { user, list } = this.props
    const contacts = selectContacts(list)

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
            title={this.state.pageTitle}
            isSideMenuOpen={this.state.isSideMenuOpen}
            user={user}
            onMenuTriggerChange={this.toggleSideMenu}
          />

          <ContactFilters onFilterChange={this.handleFilterChange} />

          <GridContainer>
            <SearchContacts
              onSearch={this.handleSearch}
              isSearching={this.state.isFetchingContacts}
            />
            <Table
              data={contacts}
              listInfo={this.props.listInfo}
              isFetching={this.state.isFetchingContacts}
              isFetchingMore={this.state.isFetchingMoreContacts}
              isRowsUpdating={this.state.isRowsUpdating}
              onRequestLoadMore={this.handleLoadMore}
              rowsUpdating={this.rowsUpdating}
              resetSelectedRows={this.resetSelectedRows}
              onChangeSelectedRows={this.onChangeSelectedRows}
              selectedRows={this.state.selectedRows}
              onRequestDelete={this.handleOnDelete}
              filters={this.state.filters}
            />
          </GridContainer>
        </PageContent>
      </PageContainer>
    )
  }
}

function mapStateToUser({ user, contacts }) {
  const listInfo = selectContactsInfo(contacts.list)

  return {
    listInfo,
    user,
    filter: listInfo.filter || [],
    list: contacts.list
  }
}

export default connect(
  mapStateToUser,
  { getContacts, searchContacts, deleteContacts, confirmation }
)(ContactsList)
