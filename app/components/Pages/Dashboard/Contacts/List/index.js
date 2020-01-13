import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import _ from 'underscore'
import { FlexItem } from 'styled-flex-component'

import { confirmation } from 'actions/confirmation'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { deleteContacts, getContacts, searchContacts } from 'actions/contacts'
import { setContactsListTextFilter } from 'actions/contacts/set-contacts-list-text-filter'
import { updateFilterSegment } from 'actions/filter-segments'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import {
  selectContacts,
  selectContactsInfo,
  selectContactsListFetching
} from 'reducers/contacts/list'
import {
  getUserSettingsInActiveTeam,
  viewAs,
  viewAsEveryoneOnTeam
} from 'utils/user-teams'
import { deleteContactsBulk } from 'models/contacts/delete-contacts-bulk'
import { CRM_LIST_DEFAULT_ASSOCIATIONS } from 'models/contacts/helpers/default-query'
import { updateTagTouchReminder } from 'models/contacts/update-tag-touch-reminder'
import {
  Container as PageContainer,
  Content as PageContent,
  Menu as SideMenu
} from 'components/SlideMenu'
import SavedSegments from 'components/Grid/SavedSegments/List'
import { resetGridSelectedItems } from 'components/Grid/Table/Plugins/Selectable'
import { isAttributeFilter, normalizeAttributeFilters } from 'crm/List/utils'
import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { Callout } from 'components/Callout'
import { AlphabetFilter } from 'components/AlphabetFilter'
import { updateTeamSetting } from 'actions/user/update-team-setting'
import { selectActiveSavedSegment } from 'reducers/filter-segments'

import Table from './Table'
import { SearchContacts } from './Search'
import Header from './Header'
import ContactFilters from './Filters'
import TagsList from './TagsList'
import AllContactsList from './AllContactsList'
import FlowsList from './FlowsList'

import {
  FLOW_FILTER_ID,
  OPEN_HOUSE_FILTER_ID,
  SORT_FIELD_SETTING_KEY,
  SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY,
  SYNCED_CONTACTS_LIST_ID,
  DUPLICATE_CONTACTS_LIST_ID
} from './constants'
import { CalloutSpinner, Container, SearchWrapper } from './styled'
import { CONTACTS_SEGMENT_NAME } from '../constants'
import {
  clearImportingGoogleContacts,
  getNewConnectedGoogleAccount
} from './ImportContactsButton/helpers'
import { SyncSuccessfulModal } from './SyncSuccesfulModal'
import { ZeroState } from './ZeroState'
import { getPredefinedContactLists } from './utils/get-predefined-contact-lists'
import Duplicates from './Duplicates'

const DEFAULT_QUERY = {
  associations: CRM_LIST_DEFAULT_ASSOCIATIONS
}

class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSidebarFilter: null,
      firstLetter: props.location.query.letter || null,
      isSideMenuOpen: true,
      isShowingDuplicatesList:
        props.activeSegment.id === DUPLICATE_CONTACTS_LIST_ID,
      isFetchingMoreContacts: false,
      isFetchingMoreContactsBefore: false,
      isRowsUpdating: false,
      searchInputValue: props.list.textFilter,
      loadedRanges: []
    }

    this.order = getUserSettingsInActiveTeam(props.user, SORT_FIELD_SETTING_KEY)
    this.tableContainerId = 'contacts--page-container'
  }

  componentDidMount() {
    this.props.fetchOAuthAccounts()
    this.fetchContactsAndJumpToSelected()

    if (this.props.fetchTags) {
      this.props.getContactsTags()
    }

    this.setSelectedSidebarFilter()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    Object.entries(this.props.oAuthAccounts).forEach(([provider, accounts]) => {
      if (!_.isEqual(nextProps.oAuthAccounts[provider], accounts)) {
        this.updateSyncState(provider, nextProps.oAuthAccounts)
      }
    })

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

  setSelectedSidebarFilter = () => {
    const { activeSegment, filters, flows } = this.props

    if (
      activeSegment &&
      activeSegment.name &&
      activeSegment.id !== 'default' &&
      this.state.selectedSidebarFilter === null
    ) {
      this.setState({ selectedSidebarFilter: null })
    } else if (filters && filters.length === 1) {
      this.setState({ selectedSidebarFilter: filters })
    } else if (flows && flows.length === 1) {
      this.setState({ selectedSidebarFilter: flows })
    }
  }

  getHeaderTitle = () => {
    const { activeFilters, activeSegment, filters, flows } = this.props

    if (
      activeSegment &&
      activeSegment.name &&
      activeSegment.id !== 'default' &&
      this.state.selectedSidebarFilter === null
    ) {
      return `List: ${activeSegment.name}`
    }

    if (
      filters &&
      filters.length === 1 &&
      this.state.selectedSidebarFilter !== null
    ) {
      return `Tag: ${filters[0].value}`
    }

    if (
      flows &&
      flows.length === 1 &&
      this.state.selectedSidebarFilter !== null
    ) {
      return `Flow: ${activeFilters[0].values[0].label}`
    }

    return 'All Contacts'
  }

  updateSyncState(provider, oAuthAccounts = this.props.oAuthAccounts) {
    const account = getNewConnectedGoogleAccount(provider, oAuthAccounts)

    if (account) {
      switch (account.sync_status) {
        case null:
        case 'pending':
          this.setState({ syncStatus: 'pending' })
          break
        case 'success':
          clearImportingGoogleContacts(provider)
          this.setState({
            syncStatus: 'finished',
            syncedAccountProvider: provider
          })
          break
      }
    } else {
      clearImportingGoogleContacts(provider)
    }
  }

  async fetchContactsAndJumpToSelected() {
    this.setState({
      isFetchingMoreContacts: true
    })

    const start = Math.max(parseInt(this.getQueryParam('s'), 10), 0) || 0
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

  /**
   * @param {ISavedSegment} savedSegment
   */
  handleChangeSavedSegment = savedSegment => {
    this.setState({
      selectedSidebarFilter: null
    })
    this.handleFilterChange({}, true)

    if (savedSegment.id === SYNCED_CONTACTS_LIST_ID) {
      this.updateSyncedContactsSeenDate()
    }
  }

  updateSyncedContactsSeenDate() {
    this.props.updateTeamSetting(
      SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY,
      new Date()
    )
  }

  handleFilterChange = async (
    newFilters,
    resetLoadedRanges = false,
    newOrder = this.order
  ) => {
    if (this.state.isShowingDuplicatesList) {
      return
    }

    const {
      filters = this.props.filters,
      searchInputValue = this.state.searchInputValue,
      start = 0,
      order = newOrder,
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
    if (this.state.isShowingDuplicatesList) {
      return
    }

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

  isDefaultSegmentSelected = () => {
    return this.props.activeSegment && this.props.activeSegment.id === 'default'
  }

  isFilteredWithTagsOrFlows = () => {
    return this.props.filters.length > 0 || this.props.flows.length > 0
  }

  shouldShowImportAndCreateActions = () => {
    return this.isDefaultSegmentSelected() && !this.isFilteredWithTagsOrFlows()
  }

  shouldShowFilters = () => {
    return this.state.selectedSidebarFilter === null
  }

  handleListTouchReminderUpdate = async value => {
    const segment = {
      ...this.props.activeSegment,
      touch_freq: value
    }

    await this.props.updateSegment(
      CONTACTS_SEGMENT_NAME,
      segment,
      DEFAULT_QUERY
    )
  }

  handleTagTouchReminderUpdate = async value => {
    const activeTag = this.getActiveTag()

    if (!activeTag) {
      return
    }

    await updateTagTouchReminder(activeTag.text, value)
    this.props.getContactsTags()
  }

  getActiveTag = () => {
    // all or segmented list
    if (!Array.isArray(this.state.selectedSidebarFilter)) {
      return undefined
    }

    // flow
    if (
      this.state.selectedSidebarFilter.some(item => typeof item === 'string')
    ) {
      return undefined
    }

    // tag
    return Object.values(this.props.tags).find(value => {
      return value.text === this.state.selectedSidebarFilter[0].value
    })
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

    const syncing = Object.values(this.props.oAuthAccounts)
      .flat()
      .some(account => account.sync_status !== 'success')

    const isZeroState =
      !isFetchingContacts &&
      contacts.length === 0 &&
      props.filters.length === 0 &&
      props.flows.length === 0 &&
      props.crmTasks.length === 0 &&
      !state.firstLetter &&
      !syncing &&
      !state.syncStatus &&
      !this.state.searchInputValue &&
      (!activeSegment ||
        !activeSegment.filters ||
        activeSegment.filters.length === 0)

    const title = this.getHeaderTitle()

    return (
      <PageContainer isOpen={isSideMenuOpen}>
        <SideMenu isOpen={isSideMenuOpen} width="13rem">
          <AllContactsList
            activeSegment={activeSegment}
            onFilterChange={(selectedSegment, type) => {
              this.setState({ selectedSidebarFilter: null })

              this.setState({
                isShowingDuplicatesList: type === DUPLICATE_CONTACTS_LIST_ID
              })

              // Synced contacts
              if (selectedSegment) {
                this.handleChangeSavedSegment(selectedSegment)

                return
              }

              // All contacts selected
              this.handleFilterChange({ filters: [], flows: [] }, true)
            }}
          />
          <TagsList
            onFilterChange={filters => {
              this.setState({
                selectedSidebarFilter: filters.filters,
                isShowingDuplicatesList: false
              })
              this.handleFilterChange({ ...filters, flows: [] }, true)
            }}
            isActive={this.state.selectedSidebarFilter !== null}
          />
          <FlowsList
            onChange={_.debounce(() => {
              this.setState({
                selectedSidebarFilter: this.props.flows,
                isShowingDuplicatesList: false
              })
              this.handleFilterChange({}, true)
            }, 300)}
            isActive={this.state.selectedSidebarFilter !== null}
          />
          <SavedSegments
            name={CONTACTS_SEGMENT_NAME}
            associations={CRM_LIST_DEFAULT_ASSOCIATIONS}
            getPredefinedLists={() => ({})}
            onChange={segment => {
              this.setState({ isShowingDuplicatesList: false })
              this.handleChangeSavedSegment(segment)
            }}
          />
        </SideMenu>

        <PageContent id={this.tableContainerId} isSideMenuOpen={isSideMenuOpen}>
          {this.state.syncStatus === 'pending' && (
            <Callout
              type="info"
              onClose={() => this.setState({ syncStatus: null })}
            >
              <CalloutSpinner viewBox="20 20 60 60" />
              Doing Science! Just a moment for Rechat to complete establishing
              connections and importing your contacts.
            </Callout>
          )}
          {this.state.syncStatus === 'finished' && (
            <SyncSuccessfulModal
              provider={this.state.syncedAccountProvider}
              close={() => {
                this.setState({ syncStatus: null })
                this.reloadContacts()
                this.props.getContactsTags()
              }}
              handleFilterChange={filters => {
                this.setState({ syncStatus: null })
                this.props.getContactsTags()
                this.updateSyncedContactsSeenDate()
                this.handleFilterChange({ filters }, true, '-updated_at')
              }}
            />
          )}
          {isZeroState && <ZeroState />}
          {!isZeroState && this.state.isShowingDuplicatesList && (
            <Duplicates
              isSideMenuOpen={this.state.isSideMenuOpen}
              onSideMenuTriggerClick={this.toggleSideMenu}
            />
          )}
          {!isZeroState && !this.state.isShowingDuplicatesList && (
            <>
              <Header
                title={title}
                activeSegment={activeSegment}
                activeTag={this.getActiveTag()}
                onListTouchReminderUpdate={this.handleListTouchReminderUpdate}
                onTagTouchReminderUpdate={this.handleTagTouchReminderUpdate}
                showActions={!isZeroState}
                showImportAction={this.shouldShowImportAndCreateActions()}
                showCreateAction={this.shouldShowImportAndCreateActions()}
                isSideMenuOpen={state.isSideMenuOpen}
                user={user}
                onMenuTriggerChange={this.toggleSideMenu}
              />
              <Container>
                {this.shouldShowFilters() && (
                  <ContactFilters
                    onFilterChange={() => this.handleFilterChange({}, true)}
                    users={viewAsUsers}
                  />
                )}
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
            </>
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
function mapStateToProps({ user, contacts, ...restOfState }) {
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
    tags: tags.byId,
    oAuthAccounts: contacts.oAuthAccounts.list,
    fetchTags,
    activeFilters,
    filters: normalizeAttributeFilters(attributeFilters),
    filterSegments,
    conditionOperator: filterSegments.conditionOperator,
    isFetchingContacts: selectContactsListFetching(contacts.list),
    flows: flowFilters.map(filter => filter.values[0].value),
    crmTasks: openHouseFilters.map(filter => filter.values[0].value),
    list: contacts.list,
    listInfo,
    user,
    activeSegment: selectActiveSavedSegment(
      filterSegments,
      'contacts',
      getPredefinedContactLists('Contacts', { user, contacts, ...restOfState })
    ),
    viewAsUsers: viewAsEveryoneOnTeam(user) ? [] : viewAs(user)
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getContacts,
      fetchOAuthAccounts,
      searchContacts,
      deleteContacts,
      confirmation,
      setContactsListTextFilter,
      getContactsTags,
      updateTeamSetting,
      updateSegment: updateFilterSegment
    }
  )(ContactsList)
)
