import React from 'react'
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

class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSideMenuOpen: true,
      isFetchingContacts: false,
      isFetchingMoreContacts: false,
      isRowsUpdating: false,
      filter: this.props.filter,
      searchInputValue: this.props.searchInputValue,
      activeSegment: {}
    }
    this.order = this.props.listInfo.order
  }

  componentDidMount() {
    if (this.props.listInfo.count === 0) {
      this.fetchContacts()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.filterSegments.activeSegmentId !==
        this.props.filterSegments.activeSegmentId &&
      nextProps.filterSegments.activeSegmentId !== this.state.activeSegment.id
    ) {
      this.handleChangeSavedSegment(
        nextProps.filterSegments.list[nextProps.filterSegments.activeSegmentId]
      )
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
        await this.handleFilterChange(
          filter,
          searchInputValue,
          start,
          this.order
        )
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
        activeSegment: segment
      },
      () => {
        this.handleFilterChange(segment.filters, this.state.searchInputValue)
      }
    )
  }

  handleFilterChange = async (filter, searchInputValue, start = 0, order) => {
    this.setState({ isFetchingContacts: true, filter })

    if (start === 0) {
      this.resetSelectedRows()
    }

    try {
      await this.props.searchContacts(
        filter,
        start,
        undefined,
        searchInputValue,
        order
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

  handleChangeOrder = ({ value: order }) => {
    this.order = order
    this.handleFilterChange(
      this.state.filter,
      this.state.searchInputValue,
      0,
      order
    )
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
        this.state.searchInputValue,
        startFrom,
        this.order
      )
    }

    this.setState({ isFetchingMoreContacts: false })
  }

  hasSearchState = () =>
    this.state.filter || this.state.searchInputValue || this.order

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
  }

  render() {
    const { isSideMenuOpen, activeSegment } = this.state
    const { user, list } = this.props
    const contacts = selectContacts(list)

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <SideMenu isOpen={isSideMenuOpen}>
          <SavedSegments
            name="contacts"
            onChange={this.handleChangeSavedSegment}
          />
        </SideMenu>

        <PageContent>
          <Header
            title={activeSegment.name || 'All Contacts'}
            isSideMenuOpen={this.state.isSideMenuOpen}
            user={user}
            onMenuTriggerChange={this.toggleSideMenu}
          />

          <ContactFilters onFilterChange={this.handleFilterChange} />

          <SearchContacts
            onSearch={this.handleSearch}
            isSearching={this.state.isFetchingContacts}
          />
          <Table
            handleChangeOrder={this.handleChangeOrder}
            data={contacts}
            listInfo={this.props.listInfo}
            isFetching={this.state.isFetchingContacts}
            isFetchingMore={this.state.isFetchingMoreContacts}
            isRowsUpdating={this.state.isRowsUpdating}
            onRequestLoadMore={this.handleLoadMore}
            rowsUpdating={this.rowsUpdating}
            onChangeSelectedRows={this.onChangeSelectedRows}
            onRequestDelete={this.handleOnDelete}
            filters={this.state.filter}
          />
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
    list: contacts.list,
    filterSegments: contacts.filterSegments
  }
}

export default connect(
  mapStateToUser,
  { getContacts, searchContacts, deleteContacts, confirmation }
)(ContactsList)
