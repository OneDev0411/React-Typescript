import React from 'react'

import { Box } from '@material-ui/core'
import { mdiLoading } from '@mdi/js'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import _ from 'underscore'

import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { confirmation } from 'actions/confirmation'
import { deleteContacts, getContacts, searchContacts } from 'actions/contacts'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { setContactsListTextFilter } from 'actions/contacts/set-contacts-list-text-filter'
import { updateFilterSegment } from 'actions/filter-segments'
import { resetActiveFilters } from 'actions/filter-segments/active-filters'
import { changeActiveFilterSegment } from 'actions/filter-segments/change-active-segment'
import { Callout } from 'components/Callout'
import { DispatchContext as GlobalButtonDispatch } from 'components/GlobalActionsButton/context'
import { SET_CREATE_CALLBACK_HANDLER } from 'components/GlobalActionsButton/context/constants'
import PageLayout from 'components/GlobalPageLayout'
import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'
import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'
import ImportContactsButton from 'components/ImportContactsButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { ViewAs } from 'components/ViewAs'
import { isAttributeFilter, normalizeAttributeFilters } from 'crm/List/utils'
import { deleteContactsBulk } from 'models/contacts/delete-contacts-bulk'
import { getContactsCount as getParkedContactsCount } from 'models/contacts/get-contacts-count'
import { getDuplicateContacts } from 'models/contacts/get-duplicate-contacts'
import { CRM_LIST_DEFAULT_ASSOCIATIONS } from 'models/contacts/helpers/default-query'
import { updateTagTouchReminder } from 'models/contacts/update-tag-touch-reminder'
import {
  selectContacts,
  selectContactsInfo,
  selectContactsListFetching
} from 'reducers/contacts/list'
import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { selectActiveSavedSegment } from 'reducers/filter-segments'
import { goTo } from 'utils/go-to'
import {
  clearImportingGoogleContacts,
  getNewConnectedGoogleAccount
} from 'utils/oauth-provider'
import { viewAs, getTeamSetting } from 'utils/user-teams'

import { Board } from '../Board'
import { ManageRelationship } from '../components/ManageRelationship'
import { CONTACTS_SEGMENT_NAME } from '../constants'

import {
  FLOW_FILTER_ID,
  CONTACT_CHUNK_COUNT,
  OPEN_HOUSE_FILTER_ID,
  SORT_FIELD_SETTING_KEY,
  PARKED_CONTACTS_LIST_ID,
  DUPLICATE_CONTACTS_LIST_ID,
  VIEW_MODE_FIELD_SETTING_KEY
} from './constants'
import { OtherContactsBadge } from './OtherContactsBadge'
import { ViewMode } from './styled'
import { SyncSuccessfulModal } from './SyncSuccesfulModal'
import Table from './Table'
import ContactsTabs from './Tabs'
import { getPredefinedContactLists } from './utils/get-predefined-contact-lists'
import { ContactsZeroState } from './ZeroState'

const DEFAULT_QUERY = {
  associations: CRM_LIST_DEFAULT_ASSOCIATIONS
}

class ContactsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedShortcutFilter: null,
      firstLetter: props.location.query.letter || null,
      isShowingDuplicatesList:
        props.activeSegment.id === DUPLICATE_CONTACTS_LIST_ID,
      isFetchingMoreContacts: false,
      isFetchingMoreContactsBefore: false,
      isRowsUpdating: false,
      searchInputValue: props.list.textFilter,
      loadedRanges: [],
      duplicateClusterCount: 0,
      parkedContactCount: 0,
      viewMode: 'table',
      sortOrder: '-last_touch'
    }

    this.tableContainerId = 'contacts--page-container'
  }

  componentDidMount() {
    const globalButtonDispatch = this.context

    const { getSetting, fetchTags, getContactsTags } = this.props
    const { parkedContactsCount, searchInputValue } = this.state
    const sortFieldSetting = getSetting(SORT_FIELD_SETTING_KEY)
    const relevanceSortKey = '-last_touch_rank'

    const order = searchInputValue
      ? relevanceSortKey
      : sortFieldSetting && sortFieldSetting !== relevanceSortKey
      ? sortFieldSetting
      : '-last_touch'

    this.getDuplicateClusterCount()
    this.setSelectedShortcutFilter()

    const viewMode = getSetting(VIEW_MODE_FIELD_SETTING_KEY, 'table')

    this.setState(
      {
        viewMode,
        sortOrder: order
      },
      () => this.fetchContactsAndJumpToSelected()
    )

    if (globalButtonDispatch) {
      globalButtonDispatch({
        type: SET_CREATE_CALLBACK_HANDLER,
        handlers: {
          onCreateAndAddNewContact: this.onCreateContact
        }
      })
    }

    if (!parkedContactsCount) {
      this.getParkedContactCount()
    }

    if (fetchTags) {
      getContactsTags()
    }

    this.setSelectedShortcutFilter()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    Object.entries(this.props.oAuthAccounts).forEach(([provider, accounts]) => {
      if (!_.isEqual(nextProps.oAuthAccounts[provider], accounts)) {
        this.updateSyncState(provider, nextProps.oAuthAccounts)
      }
    })

    const prevStart = this.props.location.query.s
    const nextStart = nextProps.location.query.s

    if (prevStart !== undefined && nextStart === undefined) {
      this.setQueryParam('s', prevStart)
    }
  }

  async componentWillUnmount() {
    const { selectedShortcutFilter } = this.state
    const {
      activeSegment,
      filters,
      setContactsListTextFilter,
      resetActiveFilters
    } = this.props

    if (
      filters &&
      (!selectedShortcutFilter || activeSegment.id === 'default')
    ) {
      await resetActiveFilters(CONTACTS_SEGMENT_NAME)
    }

    setContactsListTextFilter(this.state.searchInputValue)
  }

  setSelectedShortcutFilter = () => {
    const { activeSegment, filters, flows } = this.props

    if (
      activeSegment &&
      activeSegment.name &&
      activeSegment.id !== 'default' &&
      this.state.selectedShortcutFilter === null
    ) {
      this.setState({ selectedShortcutFilter: null })
    } else if (filters && filters.length === 1) {
      this.setState({ selectedShortcutFilter: filters })
    } else if (flows && flows.length === 1) {
      this.setState({ selectedShortcutFilter: flows })
    }
  }

  getHeaderTitle = () => {
    const { activeFilters, activeSegment, filters, flows } = this.props

    if (
      activeSegment &&
      activeSegment.name &&
      activeSegment.id !== 'default' &&
      this.state.selectedShortcutFilter === null
    ) {
      if (activeSegment.id === PARKED_CONTACTS_LIST_ID) {
        return activeSegment.name
      }

      return `List: ${activeSegment.name}`
    }

    if (
      filters &&
      filters.length === 1 &&
      this.state.selectedShortcutFilter !== null
    ) {
      if (filters[0].value === null) {
        return 'Contacts(un-Tagged)'
      }

      return `Tag: ${filters[0].value}`
    }

    if (
      flows &&
      flows.length === 1 &&
      this.state.selectedShortcutFilter !== null
    ) {
      return `Flow: ${activeFilters[0].values[0].label}`
    }

    return 'Contacts'
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

  getParkedContactCount = async () => {
    const { viewAsUsers } = this.props
    const parkedContactCount = await getParkedContactsCount(viewAsUsers)

    this.setState({ parkedContactCount })
  }

  getDuplicateClusterCount = async () => {
    try {
      const res = await getDuplicateContacts({ limit: 1 })
      const clusterCount = res.info.total

      if (clusterCount > 0) {
        this.setState(() => ({
          duplicateClusterCount: clusterCount
        }))
      }
    } catch (e) {
      console.log('fetch duplicate cluster error: ', e)
    }
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
    this.props.filters || this.state.searchInputValue || this.state.sortOrder

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
  handleChangeSavedSegment = () => {
    this.setState({
      selectedShortcutFilter: null
    })
    this.handleFilterChange({}, true)
  }

  handleFilterChange = async (
    newFilters,
    resetLoadedRanges = false,
    newOrder
  ) => {
    if (this.state.isShowingDuplicatesList) {
      return
    }

    const isParkedTabActive =
      this.props.activeSegment.id === PARKED_CONTACTS_LIST_ID
    const sortOrder = newOrder ?? this.state.sortOrder

    const {
      filters = this.props.filters,
      searchInputValue = this.state.searchInputValue,
      start = 0,
      order = sortOrder,
      viewAsUsers = this.props.viewAsUsers,
      flows = this.props.flows,
      crmTasks = this.props.crmTasks,
      conditionOperator = this.props.conditionOperator,
      prependResult = false,
      firstLetter = this.state.firstLetter,
      parked = isParkedTabActive
    } = newFilters || {}

    /*
      I knew it's not a good idea ((:
      But We're doing this because of the API mechanism,
      when user searches for contact we should show all contact
      in order to doing this, we have to send undefined for parked param
    */
    const shouldShowParked =
      Boolean(searchInputValue) && !isParkedTabActive ? undefined : parked

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
        shouldShowParked,
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
    } finally {
      const { parkedContactCount } = this.state

      if (parkedContactCount > 0) {
        this.getParkedContactCount()
      }
    }
  }

  handleSearch = value => {
    const { sortOrder } = this.state
    const { getSetting } = this.props
    const relevanceSortKey = '-last_touch_rank'
    let order = sortOrder

    if (value) {
      order = relevanceSortKey
    } else if (order === relevanceSortKey) {
      order = getSetting(SORT_FIELD_SETTING_KEY, '-last_touch')
    }

    this.setState(
      { searchInputValue: value, sortOrder: order, firstLetter: null },
      () => {
        this.setQueryParam('letter', '')

        this.handleFilterChange({ parked: undefined }, true, order)
      }
    )
  }

  handleFirstLetterChange = value => {
    this.setQueryParam('letter', value)
    this.setState({ firstLetter: value }, () => {
      this.handleFilterChange({}, true)
    })
  }

  changeSortOrder = ({ value: order }) => {
    if (order === this.state.sortOrder) {
      return
    }

    const { setActiveTeamSetting } = this.props

    this.setState(
      {
        sortOrder: order
      },
      () => this.handleFilterChange({}, true)
    )
    setActiveTeamSetting(SORT_FIELD_SETTING_KEY, order)
  }

  handleLoadMore = async () => {
    if (this.state.isShowingDuplicatesList) {
      return
    }

    const { total } = this.props.listInfo
    const totalLoadedCount = this.props.list.ids.length
    const prevStart = parseInt(this.getQueryParam('s'), 10) || 0
    const start =
      Math.max(prevStart, ...this.state.loadedRanges) + CONTACT_CHUNK_COUNT

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
      prevStart < CONTACT_CHUNK_COUNT
    ) {
      return false
    }

    const start = prevStart - CONTACT_CHUNK_COUNT

    if (this.state.loadedRanges.includes(start)) {
      return false
    }

    console.log(`[ Loading More Before ] Start: ${start}`)

    this.setState({ isFetchingMoreContactsBefore: true })

    await this.fetchList(start, true)

    this.setState({ isFetchingMoreContactsBefore: false })
  }

  handleOnDelete = (e, options) => {
    const singleSelectedRow =
      options && options.singleSelectedRow ? options.singleSelectedRow : []
    const gridState = this.props.gridStateContext
    const {
      selection: { isEntireRowsSelected, selectedRowIds, excludedRows }
    } = gridState

    const selectedRowsLength = isEntireRowsSelected
      ? this.props.listInfo.total - excludedRows.length
      : selectedRowIds.length
    const isSingleContact = singleSelectedRow.length === 1
    const isManyContacts = isSingleContact
      ? false
      : isEntireRowsSelected || selectedRowsLength > 1

    this.props.confirmation({
      confirmLabel: 'Delete',
      message: `Delete ${isManyContacts ? 'contacts' : 'contact'}?`,
      onConfirm: () => {
        this.handleDeleteContact({ singleSelectedRow })
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

  handleDeleteContact = async ({ singleSelectedRow }) => {
    const { activeSegment, gridStateContext } = this.props
    const {
      selection: { isEntireRowsSelected, selectedRowIds, excludedRows }
    } = gridStateContext
    const isParkedTabActive = activeSegment.id === PARKED_CONTACTS_LIST_ID

    const isSingleContact = singleSelectedRow.length === 1

    try {
      this.rowsUpdating(true)

      if (isEntireRowsSelected && !isSingleContact) {
        const bulkDeleteParams = {
          users: this.props.viewAsUsers,
          searchText: this.state.searchInputValue,
          conditionOperator: this.props.conditionOperator,
          filters: this.props.filters,
          excludes: excludedRows,
          parked: isParkedTabActive
        }

        await deleteContactsBulk(bulkDeleteParams)
        this.setState(() => ({
          duplicateClusterCount: 0
        }))
        await this.reloadContacts()
      } else {
        const rows =
          selectedRowIds.length > 0 && !isSingleContact
            ? selectedRowIds
            : singleSelectedRow

        await this.props.deleteContacts(rows)
      }

      this.rowsUpdating(false)
      this.resetSelectedRows()
    } catch (error) {
      console.log(error)
    } finally {
      if (isParkedTabActive) {
        this.getParkedContactCount()
      }
    }
  }

  rowsUpdating = isRowsUpdating => this.setState({ isRowsUpdating })

  resetSelectedRows = () => {
    this.props.gridDispatchContext(resetRows())
  }

  reloadContacts = async (start = 0) => {
    const { parkedContactCount, sortOrder } = this.state
    const { activeSegment, searchContacts } = this.props
    const isParkedTabActive = activeSegment.id === PARKED_CONTACTS_LIST_ID

    if (parkedContactCount > 0) {
      this.getParkedContactCount()
    }

    await searchContacts(
      this.props.filters,
      start,
      undefined,
      isParkedTabActive,
      this.state.searchInputValue,
      sortOrder,
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
    if (this.props?.activeSegment?.id === PARKED_CONTACTS_LIST_ID) {
      return false
    }

    return this.state.selectedShortcutFilter === null
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

  handleResetShortcutFilter = () => {
    this.setState(() => ({
      selectedShortcutFilter: null
    }))
  }

  getActiveTag = () => {
    // all or segmented list
    if (!Array.isArray(this.state.selectedShortcutFilter)) {
      return undefined
    }

    // flow
    if (
      this.state.selectedShortcutFilter.some(item => typeof item === 'string')
    ) {
      return undefined
    }

    // tag
    return Object.values(this.props.tags).find(value => {
      return value.text === this.state.selectedShortcutFilter[0].value
    })
  }

  onCreateContact = contact => {
    if (!contact) {
      return null
    }

    this.reloadContacts()
  }

  renderOtherContactsBadge = () => {
    const {
      resetActiveFilters,
      changeActiveFilterSegment,
      isFetchingContacts
    } = this.props
    const { parkedContactCount, duplicateClusterCount } = this.state

    if (!parkedContactCount && !duplicateClusterCount) {
      return null
    }

    return (
      <Box display="flex" alignItems="center">
        {parkedContactCount > 0 && (
          <Box mr={duplicateClusterCount > 0 ? 1 : 0}>
            <OtherContactsBadge
              disabled={isFetchingContacts}
              title="New contacts to review and add"
              count={parkedContactCount}
              onClick={async () => {
                await resetActiveFilters(CONTACTS_SEGMENT_NAME)
                await changeActiveFilterSegment(
                  CONTACTS_SEGMENT_NAME,
                  PARKED_CONTACTS_LIST_ID
                )
                this.handleFilterChange({ parked: true }, true)
                this.handleResetShortcutFilter()
              }}
            />
          </Box>
        )}
        {duplicateClusterCount > 0 && (
          <OtherContactsBadge
            disabled={isFetchingContacts}
            title="Duplicate Contacts"
            count={duplicateClusterCount}
            onClick={() => goTo('/dashboard/contacts/duplicates')}
          />
        )}
      </Box>
    )
  }

  changeViewMode = viewMode => {
    if (viewMode === this.state.viewMode) {
      return
    }

    this.setState({
      viewMode
    })

    this.props.setActiveTeamSetting(VIEW_MODE_FIELD_SETTING_KEY, viewMode)

    this.reloadContacts()
  }

  renderTabs = (props = {}) => {
    const { selectedShortcutFilter, searchInputValue, sortOrder, viewMode } =
      this.state
    const { viewAsUsers, listInfo, activeSegment } = this.props

    return (
      <ContactsTabs
        handleFilterChange={this.handleFilterChange}
        handleChangeSavedSegment={this.handleChangeSavedSegment}
        handleResetShortcutFilter={this.handleResetShortcutFilter}
        filter={{
          show: this.shouldShowFilters()
        }}
        tagListProps={{
          onClick: filters => {
            this.setState({
              selectedShortcutFilter: filters.filters
            })
            this.handleFilterChange({ ...filters, flows: [] }, true)
          },
          isActive: selectedShortcutFilter !== null
        }}
        savedListProps={{
          name: CONTACTS_SEGMENT_NAME,
          associations: CRM_LIST_DEFAULT_ASSOCIATIONS,
          getPredefinedLists: () => ({}),
          onChange: segment => {
            this.handleChangeSavedSegment(segment)
          }
        }}
        sortProps={{
          onChange: this.changeSortOrder,
          currentOrder: sortOrder,
          searchValue: searchInputValue
        }}
        contactCount={listInfo.total || 0}
        users={viewAsUsers}
        activeSegment={activeSegment}
        onChangeView={this.changeViewMode}
        viewMode={viewMode}
        {...props}
      />
    )
  }

  render() {
    const { props, state } = this
    const { list, viewAsUsers, isFetchingContacts, activeSegment } = this.props
    const contacts = selectContacts(list)
    const isParkedTabActive =
      activeSegment && activeSegment.id === PARKED_CONTACTS_LIST_ID
    const syncing = Object.values(this.props.oAuthAccounts)
      .flat()
      .some(account => account.sync_status !== 'success')
    const isTableMode = this.state.viewMode === 'table'
    const isBoardMode = this.state.viewMode === 'board'

    const isZeroState =
      !isParkedTabActive &&
      !isFetchingContacts &&
      contacts.length === 0 &&
      props.filters.length === 0 &&
      props.flows.length === 0 &&
      props.crmTasks.length === 0 &&
      !state.firstLetter &&
      !syncing &&
      !state.syncStatus &&
      !state.searchInputValue &&
      (!activeSegment ||
        !activeSegment.filters ||
        activeSegment.filters.length === 0)

    const title = this.getHeaderTitle()
    const showImportAction = this.shouldShowImportAndCreateActions()
    const activeTag = this.getActiveTag()

    return (
      <PageLayout
        gutter={0}
        {...(isBoardMode && {
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          pb: 1
        })}
      >
        <PageLayout.HeaderWithSearch
          flex="0 1 auto"
          title={title}
          onSearch={this.handleSearch}
          gutter={4}
          noPadding={false}
          SearchInputProps={{
            defaultValue: this.state.searchInputValue || '',
            placeholder: 'Search Contacts'
          }}
        >
          {!isZeroState && (
            <Box display="flex" ml={1}>
              {activeSegment && activeSegment.is_editable && (
                <ManageRelationship
                  value={activeSegment.touch_freq}
                  onChange={this.handleListTouchReminderUpdate}
                  label="Manage Relationships"
                />
              )}
              {activeTag && activeTag.id && (
                <ManageRelationship
                  value={activeTag.touch_freq}
                  onChange={this.handleTagTouchReminderUpdate}
                  label="Manage Relationships"
                />
              )}
              {showImportAction && (
                <ImportContactsButton
                  hasCSVButton
                  tooltip="Connect to Google, Outlook or import from a CSV"
                />
              )}
            </Box>
          )}
          <ViewAs containerStyle={{ marginLeft: '0.5rem' }} />
        </PageLayout.HeaderWithSearch>
        <PageLayout.Main
          mt={0}
          {...(isBoardMode && {
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            overflow: 'hidden',
            px: 4
          })}
        >
          {this.state.syncStatus === 'pending' && (
            <Callout
              type="info"
              onClose={() => this.setState({ syncStatus: null })}
            >
              <SvgIcon
                path={mdiLoading}
                spin={1}
                style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}
              />
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
                this.handleFilterChange({ filters }, true, '-updated_at')
              }}
            />
          )}
          {isZeroState && <ContactsZeroState />}
          {!isZeroState && !this.state.isShowingDuplicatesList && (
            <>
              <Box px={isTableMode ? 4 : 0}>
                {isTableMode && this.renderOtherContactsBadge()}
                {this.renderTabs()}
              </Box>

              <Box
                mt={2}
                {...(isBoardMode && {
                  flexGrow: 1,
                  overflow: 'hidden'
                })}
              >
                <ViewMode enabled={isBoardMode}>
                  {isBoardMode && (
                    <Board
                      criteria={{
                        searchTerm: state.searchInputValue,
                        filters: props.filters,
                        flows: props.flows,
                        crmTasks: props.crmTasks,
                        conditionOperator: props.conditionOperator,
                        sortOrder: state.sortOrder
                      }}
                    />
                  )}
                </ViewMode>

                <ViewMode enabled={isTableMode}>
                  <Table
                    data={contacts}
                    order={state.sortOrder}
                    totalRows={props.listInfo.total || 0}
                    listInfo={props.listInfo}
                    activeSegment={activeSegment}
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
                </ViewMode>
              </Box>
            </>
          )}
        </PageLayout.Main>
      </PageLayout>
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
  const viewAsUsers = viewAs(restOfState.activeTeam ?? null)
  const getSetting = getTeamSetting(restOfState.activeTeam ?? null)

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
    getSetting,
    viewAsUsers,
    activeSegment: selectActiveSavedSegment(
      filterSegments,
      'contacts',
      getPredefinedContactLists('Contacts', { user, contacts, ...restOfState })
    )
  }
}

ContactsList.contextType = GlobalButtonDispatch

export default withRouter(
  connect(mapStateToProps, {
    getContacts,
    searchContacts,
    deleteContacts,
    confirmation,
    setContactsListTextFilter,
    getContactsTags,
    resetActiveFilters,
    changeActiveFilterSegment,
    setActiveTeamSetting,
    updateSegment: updateFilterSegment
  })(ContactsList)
)
