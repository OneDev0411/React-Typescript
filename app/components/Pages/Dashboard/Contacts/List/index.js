import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
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
// import DuplicateContacts from '../components/DuplicateContacts'
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
      console.log('BH', browserHistory.getCurrentLocation())
      this.fetchList(browserHistory.getCurrentLocation().query.s || 0)
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
        filters: this.state.filters,
        searchInputValue: this.state.searchInputValue,
        start: 0,
        order: this.order,
        viewAsUsers,
        conditionOperator:
          nextProps.conditionOperator || this.props.conditionOperator
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
    this.setState(
      {
        activeSegment: segment
      },
      () => {
        let conditionOperator = 'and'

        if (segment.args && segment.args.filter_type) {
          conditionOperator = segment.args.filter_type
        }

        this.handleFilterChange({
          filters: segment.filters,
          searchInputValue: this.state.searchInputValue,
          start: 0,
          order: this.order,
          viewAsUsers: this.props.viewAsUsers,
          conditionOperator
        })
      }
    )
  }

  handleFilterChange = async newFilters => {
    const {
      filters = this.state.filters,
      searchInputValue = this.state.searchInputValue,
      start = 0,
      order = this.order,
      viewAsUsers = this.props.viewAsUsers,
      conditionOperator = this.props.conditionOperator,
      prependResult = false
    } = newFilters

    this.setState({ filters })

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
        conditionOperator,
        prependResult
      )
    } catch (e) {
      console.log('fetch search error: ', e)
    }
  }

  handleSearch = value => {
    console.log(`[ Search ] ${value}`)
    this.setState({ searchInputValue: value })
    this.handleFilterChange({
      filters: this.state.filters,
      searchInputValue: value
    })
  }

  handleChangeOrder = ({ value: order }) => {
    this.order = order
    this.handleFilterChange({
      filters: this.state.filters,
      searchInputValue: this.state.searchInputValue
    })
  }

  handleChangeContactsAttributes = () => {
    this.handleFilterChange({
      filters: this.state.filters,
      searchInputValue: this.state.searchInputValue
    })
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  handleLoadMore = async () => {
    const { total } = this.props.listInfo
    const totalLoadedCount = this.props.list.ids.length
    const startFrom =
      parseInt(browserHistory.getCurrentLocation().query.s, 10) || 0

    if (this.state.isFetchingMoreContacts || totalLoadedCount === total) {
      return false
    }

    const start = startFrom + 50

    console.log(`[ Loading More ] Start: ${start}`)

    browserHistory.replace(
      `${browserHistory.getCurrentLocation().pathname}?s=${start}`
    )

    this.setState({ isFetchingMoreContacts: true })

    if (this.hasSearchState()) {
      await this.fetchList(start)
    } else {
      await this.handleFilterChange({
        filters: this.state.filters,
        searchInputValue: this.state.searchInputValue,
        start
      })
    }

    this.setState({ isFetchingMoreContacts: false })
  }

  handleLoadMoreBefore = async () => {
    const { total } = this.props.listInfo
    const totalLoadedCount = this.props.list.ids.length
    const startFrom =
      parseInt(browserHistory.getCurrentLocation().query.s, 10) || 0

    if (
      this.state.isFetchingMoreContacts ||
      totalLoadedCount === total ||
      startFrom < 50
    ) {
      return false
    }

    const start = Math.max(startFrom - totalLoadedCount, 0)

    console.log(`[ Loading More Before ] Start: ${start}`)

    browserHistory.replace(
      `${browserHistory.getCurrentLocation().pathname}?s=${start}`
    )

    this.setState({ isFetchingMoreContacts: true })

    if (this.hasSearchState()) {
      await this.fetchList(start)
    } else {
      await this.handleFilterChange({
        filters: this.state.filters,
        searchInputValue: this.state.searchInputValue,
        start,
        prependResult: true
      })
    }

    this.setState({ isFetchingMoreContacts: false })
  }

  handleOnDelete = (e, { selectedRows, resetSelectedRows }) => {
    const selectedRowsLength = selectedRows.length

    this.props.confirmation({
      show: true,
      confirmLabel: 'Delete',
      message: `Delete ${selectedRowsLength > 1 ? 'contacts' : 'contact'}`,
      onConfirm: () =>
        this.handleDeleteContact(selectedRows, resetSelectedRows),
      description: `Are you sure you want to delete ${
        selectedRowsLength > 1
          ? `these ${selectedRowsLength} contacts`
          : 'this contact'
      }?`
    })
  }

  handleDeleteContact = async (ids, resetRowsHandler) => {
    try {
      this.rowsUpdating(true)

      await this.props.deleteContacts(ids)

      this.rowsUpdating(false)
      resetRowsHandler()
    } catch (error) {
      console.log(error)
    }
  }

  rowsUpdating = isRowsUpdating => this.setState({ isRowsUpdating })

  resetSelectedRows = () => {
    console.log('reset rows')
    resetGridSelectedItems('contacts')
  }

  reloadContacts = async () => {
    await this.props.searchContacts(
      this.state.filters,
      0,
      undefined,
      this.state.searchInputValue,
      this.order,
      this.props.viewAsUsers,
      this.props.conditionOperator
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
          {/* <DuplicateContacts /> */}
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
            onRequestLoadMoreBefore={this.handleLoadMoreBefore}
            rowsUpdating={this.rowsUpdating}
            onChangeSelectedRows={this.onChangeSelectedRows}
            onRequestDelete={this.handleOnDelete}
            filters={this.state.filters}
            conditionOperator={this.props.conditionOperator}
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
    viewAsUsers: viewAsEveryoneOnTeam(user) ? [] : viewAs(user)
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
