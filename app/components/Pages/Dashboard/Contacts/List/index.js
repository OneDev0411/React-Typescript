import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import _ from 'underscore'
import { FlexItem } from 'styled-flex-component'

import { confirmation } from 'actions/confirmation'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { deleteContacts, getContacts, searchContacts } from 'actions/contacts'
import { setContactsListTextFilter } from 'actions/contacts/set-contacts-list-text-filter'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import {
  selectContacts,
  selectContactsInfo,
  selectContactsListFetching
} from 'reducers/contacts/list'

import {
  getActiveTeamSettings,
  viewAs,
  viewAsEveryoneOnTeam
} from 'utils/user-teams'

import { deleteContactsBulk } from 'models/contacts/delete-contacts-bulk'
import { CRM_LIST_DEFAULT_ASSOCIATIONS } from 'models/contacts/helpers/default-query'

import {
  Container as PageContainer,
  Content as PageContent,
  Menu as SideMenu
} from 'components/SlideMenu'
import SavedSegments from 'components/Grid/SavedSegments/List'
import { resetGridSelectedItems } from 'components/Grid/Table/Plugins/Selectable'

import { isAttributeFilter, normalizeAttributeFilters } from 'crm/List/utils'

import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'

import { fetchGoogleAccounts } from 'actions/contacts/fetch-google-accounts'

import { Callout } from 'components/Callout'

import { AlphabetFilter } from 'components/AlphabetFilter'

import Table from './Table'
import { SearchContacts } from './Search'
import Header from './Header'
import ContactFilters from './Filters'
import TagsList from './TagsList'

import {
  FLOW_FILTER_ID,
  OPEN_HOUSE_FILTER_ID,
  SORT_FIELD_SETTING_KEY
} from './constants'
import { CalloutSpinner, Container, SearchWrapper } from './styled'
import { CONTACTS_SEGMENT_NAME } from '../constants'
import {
  clearImportingGoogleContacts,
  getNewConnectedGoogleAccount
} from './ImportContactsButton/helpers'
import { SyncSuccessfulModal } from './SyncSuccesfulModal'
import { ZeroState } from './ZeroState'

class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstLetter: this.props.location.query.letter || null,
      isSideMenuOpen: true,
      isFetchingMoreContacts: false,
      isFetchingMoreContactsBefore: false,
      isRowsUpdating: false,
      searchInputValue: this.props.list.textFilter,
      loadedRanges: []
    }

    this.order = getActiveTeamSettings(props.user, SORT_FIELD_SETTING_KEY)
    this.tableContainerId = 'contacts--page-container'
  }

  componentDidMount() {
    this.props.fetchGoogleAccounts()
    this.fetchContactsAndJumpToSelected()

    if (this.props.fetchTags) {
      this.props.getContactsTags()
    }
  }

  updateSyncState(googleAccounts = this.props.googleAccounts) {
    const account = getNewConnectedGoogleAccount(googleAccounts)

    if (account) {
      switch (account.sync_status) {
        case null:
        case 'pending':
          this.setState({ syncStatus: 'pending' })
          break
        case 'success':
          clearImportingGoogleContacts()
          this.setState({ syncStatus: 'finished' })
          break
      }
    } else {
      clearImportingGoogleContacts()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.googleAccounts, this.props.googleAccounts)) {
      this.updateSyncState(nextProps.googleAccounts)
    }

    if (
      nextProps.viewAsUsers.length !== this.props.viewAsUsers.length ||
      !_.isEqual(nextProps.viewAsUsers, this.props.viewAsUsers)
    ) {
      const viewAsUsers = viewAsEveryoneOnTeam(nextProps.user)
        ? []
        : nextProps.viewAsUsers

      this.handleFilterChange({
        filters: this.props.filters,
        searchInputValue: this.state.searchInputValue,
        start: 0,
        order: this.order,
        viewAsUsers,
        conditionOperator:
          nextProps.conditionOperator || this.props.conditionOperator
      })

      this.props.getContactsTags(viewAsUsers)
    }

    const prevStart = this.props.location.query.s
    const nextStart = nextProps.location.query.s

    if (prevStart !== undefined && nextStart === undefined) {
      window.location.reload()
    }
  }

  componentWillUnmount() {
    this.props.setContactsListTextFilter(this.state.searchInputValue)
  }

  async fetchContactsAndJumpToSelected() {
    this.setState({
      isFetchingMoreContacts: true
    })

    const start = this.getQueryParam('s')
    const idSelector = `#grid-item-${this.getQueryParam('id')}`

    this.scrollToSelector(idSelector)

    await this.fetchList(start)

    this.setState({
      isFetchingMoreContacts: false
    })
  }

  scrollToSelector(selector) {
    const selectedElement = document.querySelector(selector)

    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'center' })
    }
  }

  addLoadedRange = start =>
    this.setState(prevState => ({
      loadedRanges: [
        ...new Set([...prevState.loadedRanges, parseInt(start, 10)])
      ]
    }))

  getQueryParam = key => this.props.location.query[key]

  setQueryParam = (key, value) => {
    const currentLocation = this.props.location
    // because in handleFilterChange before adding new queries we overwrite
    // again with previous queries for updating start number
    const letter = this.state.firstLetter

    this.props.router.replace({
      ...currentLocation,
      query: {
        ...currentLocation.query,
        letter,
        [key]: value
      }
    })
  }

  hasSearchState = () =>
    this.props.filters || this.state.searchInputValue || this.order

  fetchList = async (
    start = 0,
    loadMoreBefore = false,
    resetLoadedRanges = false
  ) => {
    if (start === 0 && !loadMoreBefore) {
      this.resetSelectedRows()
    }

    try {
      if (this.hasSearchState()) {
        await this.handleFilterChange(
          {
            start,
            prependResult: loadMoreBefore
          },
          resetLoadedRanges
        )
      } else {
        this.addLoadedRange(start)
        await this.props.getContacts(start)
      }
    } catch (e) {
      console.log('fetch contacts error: ', e)
    }
  }

  handleChangeSavedSegment = () => this.handleFilterChange({}, true)

  handleFilterChange = async (
    newFilters,
    resetLoadedRanges = false,
    newOrder
  ) => {
    const {
      filters = this.props.filters,
      searchInputValue = this.state.searchInputValue,
      start = 0,
      order = newOrder || this.order,
      viewAsUsers = this.props.viewAsUsers,
      flows = this.props.flows,
      crmTasks = this.props.crmTasks,
      conditionOperator = this.props.conditionOperator,
      prependResult = false,
      firstLetter = this.state.firstLetter
    } = newFilters || {}

    if (resetLoadedRanges) {
      this.setState({ loadedRanges: [] })
    }

    this.addLoadedRange(start)
    this.setQueryParam('s', start)

    if (start === 0 && !prependResult) {
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
        prependResult,
        {
          s: start
        },
        flows,
        crmTasks,
        firstLetter
      )
    } catch (e) {
      console.log('fetch search error: ', e)
    }
  }

  handleSearch = value => {
    this.setState({ searchInputValue: value, firstLetter: null }, () => {
      this.setQueryParam('letter', '')
      this.handleFilterChange({}, true)
    })
  }

  handleFirstLetterChange = value => {
    this.setQueryParam('letter', value)
    this.setState({ firstLetter: value }, () => {
      this.handleFilterChange({}, true)
    })
  }

  handleChangeOrder = ({ value: order }) => {
    this.order = order
    this.handleFilterChange({}, true)
  }

  toggleSideMenu = () =>
    this.setState(state => ({
      isSideMenuOpen: !state.isSideMenuOpen
    }))

  handleLoadMore = async () => {
    const { total } = this.props.listInfo
    const totalLoadedCount = this.props.list.ids.length
    const prevStart = parseInt(this.getQueryParam('s'), 10) || 0
    const start = Math.max(prevStart, ...this.state.loadedRanges) + 50

    if (
      this.state.isFetchingMoreContacts ||
      this.state.isFetchingMoreContactsBefore ||
      totalLoadedCount === total ||
      start > total
    ) {
      return false
    }

    console.log(`[ Loading More ] Start: ${start}`)

    this.setState({ isFetchingMoreContacts: true })

    await this.fetchList(start)

    this.setState({ isFetchingMoreContacts: false })
  }

  handleLoadMoreBefore = async () => {
    const { total } = this.props.listInfo
    const totalLoadedCount = this.props.list.ids.length
    const prevStart = parseInt(this.getQueryParam('s'), 10) || 0

    if (
      this.state.isFetchingMoreContacts ||
      this.state.isFetchingMoreContactsBefore ||
      totalLoadedCount === total ||
      prevStart < 50
    ) {
      return false
    }

    const start = prevStart - 50

    if (this.state.loadedRanges.includes(start)) {
      return false
    }

    console.log(`[ Loading More Before ] Start: ${start}`)

    this.setState({ isFetchingMoreContactsBefore: true })

    await this.fetchList(start, true)

    this.setState({ isFetchingMoreContactsBefore: false })
  }

  handleOnDelete = (
    e,
    {
      totalRowsCount,
      entireMode,
      selectedRows,
      excludedRows,
      resetSelectedRows
    }
  ) => {
    const selectedRowsLength = entireMode
      ? totalRowsCount - excludedRows.length
      : selectedRows.length
    const isManyContacts = entireMode ? true : selectedRowsLength > 1

    this.props.confirmation({
      confirmLabel: 'Delete',
      message: `Delete ${isManyContacts ? 'contacts' : 'contact'}?`,
      onConfirm: () => {
        this.handleDeleteContact({
          entireMode,
          selectedRows,
          excludedRows,
          resetSelectedRows
        })
      },
      description: `Deleting ${
        isManyContacts ? `these ${selectedRowsLength} contacts` : 'this contact'
      } will remove ${
        isManyContacts ? 'them' : 'it'
      } from your contacts list, but ${
        isManyContacts ? 'they' : 'it'
      }  will not be removed from any deals.`
    })
  }

  handleDeleteContact = async ({
    entireMode,
    selectedRows,
    excludedRows,
    resetSelectedRows
  }) => {
    try {
      this.rowsUpdating(true)

      if (entireMode) {
        const bulkDeleteParams = {
          users: this.props.viewAsUsers,
          searchText: this.state.searchInputValue,
          conditionOperator: this.props.conditionOperator,
          filters: this.props.filters,
          excludes: excludedRows
        }

        await deleteContactsBulk(bulkDeleteParams)
        await this.reloadContacts()
      } else {
        await this.props.deleteContacts(selectedRows)
      }

      this.rowsUpdating(false)
      resetSelectedRows()
    } catch (error) {
      console.log(error)
    }
  }

  rowsUpdating = isRowsUpdating => this.setState({ isRowsUpdating })

  resetSelectedRows = () => {
    console.log('reset rows')
    resetGridSelectedItems('contacts')
  }

  reloadContacts = async (start = 0) => {
    await this.props.searchContacts(
      this.props.filters,
      start,
      undefined,
      this.state.searchInputValue,
      this.order,
      this.props.viewAsUsers,
      this.props.conditionOperator,
      false,
      {},
      this.props.flows,
      this.props.crmTasks,
      this.state.firstLetter
    )
  }

  render() {
    const { props, state } = this
    const { isSideMenuOpen } = state
    const {
      user,
      list,
      viewAsUsers,
      isFetchingContacts,
      activeSegment
    } = this.props
    const contacts = selectContacts(list)

    const syncing = this.props.googleAccounts.some(
      account => account.sync_status !== 'success'
    )

    const isZeroState =
      !isFetchingContacts &&
      contacts.length === 0 &&
      props.filters.length === 0 &&
      !syncing &&
      !state.syncStatus &&
      !this.state.searchInputValue

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <SideMenu isOpen={isSideMenuOpen}>
          <SavedSegments
            name={CONTACTS_SEGMENT_NAME}
            associations={CRM_LIST_DEFAULT_ASSOCIATIONS}
            onChange={this.handleChangeSavedSegment}
          />
          <TagsList
            onFilterChange={filters => this.handleFilterChange(filters, true)}
          />
        </SideMenu>

        <PageContent id={this.tableContainerId} isSideMenuOpen={isSideMenuOpen}>
          {this.state.syncStatus === 'pending' && (
            <Callout onClose={() => this.setState({ syncStatus: null })}>
              <CalloutSpinner viewBox="20 20 60 60" />
              Doing Science! wait a moment till you can see how really Rechat
              works with contacts and emails
            </Callout>
          )}
          {this.state.syncStatus === 'finished' && (
            <SyncSuccessfulModal
              close={() => {
                this.setState({ syncStatus: null })
                this.reloadContacts()
                this.props.getContactsTags()
              }}
              handleFilterChange={filters => {
                this.setState({ syncStatus: null })
                this.props.getContactsTags()
                this.handleFilterChange({ filters }, true, '-updated_at')
              }}
            />
          )}
          <Header
            title={(activeSegment && activeSegment.name) || 'All Contacts'}
            activeSegment={activeSegment}
            isSideMenuOpen={state.isSideMenuOpen}
            user={user}
            showActions={!isZeroState}
            onMenuTriggerChange={this.toggleSideMenu}
          />
          {isZeroState ? (
            <ZeroState />
          ) : (
            <Container>
              <ContactFilters
                onFilterChange={() => this.handleFilterChange({}, true)}
                users={viewAsUsers}
              />
              <SearchWrapper row alignCenter>
                <FlexItem basis="100%">
                  <SearchContacts
                    onSearch={this.handleSearch}
                    isSearching={isFetchingContacts}
                  />
                </FlexItem>
                <AlphabetFilter
                  value={state.firstLetter}
                  onChange={this.handleFirstLetterChange}
                />
              </SearchWrapper>
              <Table
                data={contacts}
                order={this.order}
                listInfo={props.listInfo}
                isFetching={isFetchingContacts}
                isFetchingMore={state.isFetchingMoreContacts}
                isFetchingMoreBefore={state.isFetchingMoreContactsBefore}
                isRowsUpdating={state.isRowsUpdating}
                onRequestLoadMore={this.handleLoadMore}
                onRequestLoadMoreBefore={this.handleLoadMoreBefore}
                rowsUpdating={this.rowsUpdating}
                onChangeSelectedRows={this.onChangeSelectedRows}
                onRequestDelete={this.handleOnDelete}
                tableContainerId={this.tableContainerId}
                reloadContacts={this.reloadContacts}
                handleChangeOrder={this.handleChangeOrder}
                handleChangeContactsAttributes={() =>
                  this.handleFilterChange({}, true)
                }
                filters={{
                  alphabet: state.firstLetter,
                  attributeFilters: props.filters,
                  crm_tasks: props.crmTasks,
                  filter_type: props.conditionOperator,
                  flows: props.flows,
                  text: state.searchInputValue,
                  users: viewAsUsers
                }}
              />
            </Container>
          )}
        </PageContent>
      </PageContainer>
    )
  }
}

/**
 *
 * @param user
 * @param {IContactReduxState} contacts
 */
function mapStateToProps({ user, contacts }) {
  const listInfo = selectContactsInfo(contacts.list)
  const tags = contacts.tags
  const fetchTags = !isFetchingTags(tags) && selectTags(tags).length === 0

  const filterSegments = contacts.filterSegments
  const activeFilters = Object.values(filterSegments.activeFilters).filter(
    isFilterValid
  )
  const attributeFilters = activeFilters.filter(isAttributeFilter)
  const flowFilters = activeFilters.filter(
    filter => filter.id === FLOW_FILTER_ID
  )
  const openHouseFilters = activeFilters.filter(
    filter => filter.id === OPEN_HOUSE_FILTER_ID
  )

  return {
    googleAccounts: contacts.googleAccounts,
    fetchTags,
    filters: normalizeAttributeFilters(attributeFilters),
    filterSegments,
    conditionOperator: filterSegments.conditionOperator,
    isFetchingContacts: selectContactsListFetching(contacts.list),
    flows: flowFilters.map(filter => filter.values[0].value),
    crmTasks: openHouseFilters.map(filter => filter.values[0].value),
    list: contacts.list,
    listInfo,
    user,
    activeSegment:
      filterSegments.list &&
      filterSegments.list[filterSegments.activeSegmentId],
    viewAsUsers: viewAsEveryoneOnTeam(user) ? [] : viewAs(user)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getContacts,
      fetchGoogleAccounts,
      searchContacts,
      deleteContacts,
      confirmation,
      setContactsListTextFilter,
      getContactsTags
    }
  )(ContactsList)
)
