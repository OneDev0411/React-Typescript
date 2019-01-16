import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { confirmation } from 'actions/confirmation'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { getContacts, searchContacts, deleteContacts } from 'actions/contacts'
import { setContactsListTextFilter } from 'actions/contacts/set-contacts-list-text-filter'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import {
  selectContacts,
  selectContactsInfo,
  selectContactsListFetching
} from 'reducers/contacts/list'

import { viewAs, viewAsEveryoneOnTeam } from 'utils/user-teams'

import {
  Container as PageContainer,
  Menu as SideMenu,
  Content as PageContent
} from 'components/SlideMenu'
import SavedSegments from 'components/Grid/SavedSegments/List'
import { resetGridSelectedItems } from 'components/Grid/Table/Plugins/Selectable'

import Table from './Table'
import { SearchContacts } from './Search'
import { Header } from './Header'
import DuplicateContacts from '../components/DuplicateContacts'
import ContactFilters from './Filters'
import TagsList from './TagsList'

class ContactsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSideMenuOpen: true,
      isFetchingMoreContacts: false,
      isRowsUpdating: false,
      filters: this.props.filters,
      searchInputValue: this.props.list.textFilter,
      activeSegment: {}
    }

    this.order = this.props.listInfo.order
  }

  componentDidMount() {
    if (
      !['default', 'duplicate contacts'].includes(
        this.props.filterSegments.activeSegmentId
      )
    ) {
      this.handleChangeSavedSegment(
        this.props.filterSegments.list[
          this.props.filterSegments.activeSegmentId
        ]
      )
    } else {
      this.fetchList()
    }

    if (this.props.fetchTags) {
      this.props.getContactsTags()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.filterSegments.activeSegmentId !==
        this.props.filterSegments.activeSegmentId &&
      nextProps.filterSegments.activeSegmentId !==
        this.state.activeSegment.id &&
      nextProps.filterSegments.list[nextProps.filterSegments.activeSegmentId]
    ) {
      this.handleChangeSavedSegment(
        nextProps.filterSegments.list[nextProps.filterSegments.activeSegmentId]
      )
    }

    if (
      nextProps.viewAsUsers.length !== this.props.viewAsUsers.length ||
      !_.isEqual(nextProps.viewAsUsers, this.props.viewAsUsers)
    ) {
      const viewAsUsers = viewAsEveryoneOnTeam(nextProps.user)
        ? []
        : nextProps.viewAsUsers

      this.handleFilterChange({
        filters: this.state.filter,
        searchInputValue: this.state.searchInputValue,
        start: 0,
        order: this.order,
        viewAsUsers
      })

      this.props.getContactsTags(viewAsUsers)
    }
  }

  componentWillUnmount() {
    this.props.setContactsListTextFilter(this.state.searchInputValue)
  }

  hasSearchState = () =>
    this.state.filter || this.state.searchInputValue || this.order

  fetchList = async (start = 0) => {
    if (start === 0) {
      this.resetSelectedRows()
    }

    try {
      if (this.hasSearchState()) {
        await this.handleFilterChange({
          filters: this.state.filters,
          searchInputValue: this.state.searchInputValue,
          start
        })
      } else {
        await this.props.getContacts(start)
      }
    } catch (e) {
      console.log('fetch contacts error: ', e)
    }
  }

  handleChangeSavedSegment = segment => {
    const users =
      segment && segment.args && segment.args.users
        ? segment.args.users
        : [this.props.user.id]

    this.setState(
      {
        activeSegment: segment
      },
      () => {
        this.handleFilterChange({
          filters: segment.filters,
          searchInputValue: this.state.searchInputValue,
          start: 0,
          order: this.order,
          viewAsUsers: users
        })
      }
    )
  }

  handleFilterChange = async newFilters => {
    const {
      filters = this.state.filter,
      searchInputValue = this.state.searchInputValue,
      start = 0,
      order = this.order,
      viewAsUsers = this.props.viewAsUsers,
      conditionOperator = this.props.conditionOperator
    } = newFilters

    this.setState(state => ({
      filters: {
        ...state.filters,
        ...newFilters
      }
    }))

    if (start === 0) {
      this.resetSelectedRows()
    }

    try {
      await this.props.searchContacts(
        filters,
        start,
        undefined,
        searchInputValue,
        order,
        viewAsUsers,
        conditionOperator
      )
    } catch (e) {
      console.log('fetch search error: ', e)
    }
  }

  handleSearch = value => {
    console.log(`[ Search ] ${value}`)
    this.setState({ searchInputValue: value })
    this.handleFilterChange({
      filters: this.state.filter,
      searchInputValie: value
    })
  }

  handleChangeOrder = ({ value: order }) => {
    this.order = order
    this.handleFilterChange({
      filters: this.state.filter,
      searchInputValue: this.state.searchInputValue
    })
  }

  handleChangeContactsAttributes = () =>
    this.handleFilterChange({
      filters: this.state.filter,
      searchInputValue: this.state.searchInputValue
    })

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
      await this.fetchList(startFrom)
    } else {
      await this.handleFilterChange({
        filters: this.state.filter,
        searchInputValue: this.state.searchInputValue,
        start: startFrom
      })
    }

    this.setState({ isFetchingMoreContacts: false })
  }

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

      await this.props.deleteContacts(ids)

      this.rowsUpdating(false)
      this.resetSelectedRows()
    } catch (error) {
      console.log(error)
    }
  }

  rowsUpdating = isRowsUpdating => this.setState({ isRowsUpdating })

  resetSelectedRows = () => {
    resetGridSelectedItems('contacts')
  }

  reloadContacts = async () => {
    await this.props.searchContacts(
      this.state.filter,
      0,
      undefined,
      this.state.searchInputValue,
      this.order,
      this.props.viewAsUsers
    )
  }

  render() {
    const { isSideMenuOpen, activeSegment } = this.state
    const { user, list, viewAsUsers, isFetchingContacts } = this.props
    const contacts = selectContacts(list)

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <SideMenu isOpen={isSideMenuOpen}>
          <SavedSegments
            name="contacts"
            onChange={this.handleChangeSavedSegment}
          />
          <DuplicateContacts />
          <TagsList onFilterChange={this.handleFilterChange} />
        </SideMenu>

        <PageContent isSideMenuOpen={isSideMenuOpen}>
          <Header
            title={activeSegment.name || 'All Contacts'}
            isSideMenuOpen={this.state.isSideMenuOpen}
            user={user}
            onMenuTriggerChange={this.toggleSideMenu}
          />
          <ContactFilters
            onFilterChange={this.handleFilterChange}
            users={viewAsUsers}
          />
          <SearchContacts
            onSearch={this.handleSearch}
            isSearching={isFetchingContacts}
          />
          <Table
            bulkEventCreationCallback={this.reloadContacts}
            handleChangeOrder={this.handleChangeOrder}
            handleChangeContactsAttributes={this.handleChangeContactsAttributes}
            data={contacts}
            listInfo={this.props.listInfo}
            isFetching={isFetchingContacts}
            isFetchingMore={this.state.isFetchingMoreContacts}
            isRowsUpdating={this.state.isRowsUpdating}
            onRequestLoadMore={this.handleLoadMore}
            rowsUpdating={this.rowsUpdating}
            onChangeSelectedRows={this.onChangeSelectedRows}
            onRequestDelete={this.handleOnDelete}
            filters={this.state.filter}
            users={viewAsUsers}
          />
        </PageContent>
      </PageContainer>
    )
  }
}

function mapStateToUser({ user, contacts }) {
  const listInfo = selectContactsInfo(contacts.list)
  const tags = contacts.list
  const fetchTags = !isFetchingTags(tags) && selectTags(tags).length === 0

  return {
    fetchTags,
    filters: listInfo.filter || [],
    filterSegments: contacts.filterSegments,
    conditionOperator: contacts.filterSegments.conditionOperator,
    isFetchingContacts: selectContactsListFetching(contacts.list),
    list: contacts.list,
    listInfo,
    user,
    viewAsUsers: viewAs(user)
  }
}

export default connect(
  mapStateToUser,
  {
    getContacts,
    searchContacts,
    deleteContacts,
    confirmation,
    setContactsListTextFilter,
    getContactsTags
  }
)(ContactsList)
