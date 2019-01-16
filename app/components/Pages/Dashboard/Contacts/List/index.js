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
      filter: this.props.filter,
      searchInputValue: this.props.list.textFilter,
      activeSegment: {},
      conditionOperator: 'and'
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
        filters: {
          filter: this.state.filter,
          searchInputValue: this.state.searchInputValue,
          start: 0,
          order: this.order,
          viewAsUsers
        }
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
    const { filter, searchInputValue } = this.state

    if (start === 0) {
      this.resetSelectedRows()
    }

    try {
      if (this.hasSearchState()) {
        await this.handleFilterChange({
          filters: {
            filter,
            searchInputValue,
            start
          }
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
          filters: {
            filter: segment.filters,
            searchInputValue: this.state.searchInputValue,
            start: 0,
            order: this.order,
            viewAsUsers: users
          }
        })
      }
    )
  }

  handleFilterChange = async ({
    filters = {},
    conditionOperator = this.state.conditionOperator
  }) => {
    const {
      filter = this.state.filter,
      searchInputValue = this.state.searchInputValue,
      start = 0,
      order = this.order,
      viewAsUsers = this.props.viewAsUsers
    } = filters

    this.setState({ filter, conditionOperator })

    if (start === 0) {
      this.resetSelectedRows()
    }

    try {
      await this.props.searchContacts(
        filter,
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
      filters: {
        filter: this.state.filter,
        searchInputValie: value
      }
    })
  }

  handleChangeOrder = ({ value: order }) => {
    this.order = order
    this.handleFilterChange({
      filters: {
        filter: this.state.filter,
        searchInputValue: this.state.searchInputValue
      }
    })
  }

  handleChangeContactsAttributes = () =>
    this.handleFilterChange({
      filters: {
        filter: this.state.filter,
        searchInputValue: this.state.searchInputValue
      }
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
        filters: {
          filter: this.state.filter,
          searchInputValue: this.state.searchInputValue,
          start: startFrom
        }
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
          <TagsList
            onFilterChange={filter => {
              this.setState({ filter })
              this.handleFilterChange({ filters: { filter } })
            }}
          />
        </SideMenu>

        <PageContent isSideMenuOpen={isSideMenuOpen}>
          <Header
            title={activeSegment.name || 'All Contacts'}
            isSideMenuOpen={this.state.isSideMenuOpen}
            user={user}
            onMenuTriggerChange={this.toggleSideMenu}
          />
          <ContactFilters
            onFilterChange={change => {
              this.setState(change)
              this.handleFilterChange(change)
            }}
            users={viewAsUsers}
          />
          <SearchContacts
            onSearch={this.handleSearch}
            isSearching={isFetchingContacts}
          />
          <Table
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
            searchInputValue={this.state.searchInputValue}
            order={this.order}
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
    filter: listInfo.filter || [],
    filterSegments: contacts.filterSegments,
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
