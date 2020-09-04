import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import _ from 'underscore'
import Alert from '@material-ui/lab/Alert'
import { Box, IconButton } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import PageLayout from 'components/GlobalPageLayout'
import { ViewAs } from 'components/ViewAs'

import { confirmation } from 'actions/confirmation'
import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { deleteContacts, getContacts, searchContacts } from 'actions/contacts'
import { setContactsListTextFilter } from 'actions/contacts/set-contacts-list-text-filter'
import { updateFilterSegment } from 'actions/filter-segments'
import { getUserTeams } from 'actions/user/teams'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import {
  selectContacts,
  selectContactsInfo,
  selectContactsListFetching
} from 'reducers/contacts/list'
import { getUserSettingsInActiveTeam, viewAs } from 'utils/user-teams'
import {
  clearImportingGoogleContacts,
  getNewConnectedGoogleAccount
} from 'utils/oauth-provider'
import { getDuplicateContacts } from 'models/contacts/get-duplicate-contacts'
import { deleteContactsBulk } from 'models/contacts/delete-contacts-bulk'
import { CRM_LIST_DEFAULT_ASSOCIATIONS } from 'models/contacts/helpers/default-query'
import { updateTagTouchReminder } from 'models/contacts/update-tag-touch-reminder'
import { isAttributeFilter, normalizeAttributeFilters } from 'crm/List/utils'
import { isFilterValid } from 'components/Grid/Filters/helpers/is-filter-valid'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { Callout } from 'components/Callout'
import { updateTeamSetting } from 'actions/user/update-team-setting'
import { selectActiveSavedSegment } from 'reducers/filter-segments'
import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import ContactsTabs from './Tabs'
import Table from './Table'
import ImportContactsButton from './ImportContactsButton'
import TouchReminder from './TouchReminder'

import {
  FLOW_FILTER_ID,
  OPEN_HOUSE_FILTER_ID,
  SORT_FIELD_SETTING_KEY,
  SYNCED_CONTACTS_LAST_SEEN_SETTINGS_KEY,
  SYNCED_CONTACTS_LIST_ID,
  DUPLICATE_CONTACTS_LIST_ID
} from './constants'
import { CalloutSpinner, NavigateDuplicate } from './styled'
import { CONTACTS_SEGMENT_NAME } from '../constants'
import { SyncSuccessfulModal } from './SyncSuccesfulModal'
import { ZeroState } from './ZeroState'
import { getPredefinedContactLists } from './utils/get-predefined-contact-lists'

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
      showDuplicateClusterAlert: false,
      duplicateClusterCount: 0
    }

    this.order = null
    this.tableContainerId = 'contacts--page-container'
  }

  componentDidMount() {
    const { user, fetchOAuthAccounts, fetchTags, getContactsTags } = this.props

    this.order =
      getUserSettingsInActiveTeam(user, SORT_FIELD_SETTING_KEY) || '-last_touch'
    fetchOAuthAccounts()
    this.fetchContactsAndJumpToSelected()
    this.getDuplicateClusterCount()

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
      window.location.reload()
    }
  }

  componentWillUnmount() {
    this.props.setContactsListTextFilter(this.state.searchInputValue)
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
      return `List: ${activeSegment.name}`
    }

    if (
      filters &&
      filters.length === 1 &&
      this.state.selectedShortcutFilter !== null
    ) {
      return `Tag: ${filters[0].value}`
    }

    if (
      flows &&
      flows.length === 1 &&
      this.state.selectedShortcutFilter !== null
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

  getDuplicateClusterCount = async () => {
    try {
      const res = await getDuplicateContacts({ limit: 1 })
      const clusterCount = res.info.total

      if (clusterCount > 0) {
        this.setState(() => ({
          showDuplicateClusterAlert: true,
          duplicateClusterCount: clusterCount
        }))
      }
    } catch (e) {
      console.log('fetch duplicate cluster error: ', e)
    }
  }

  closeDupicateAlert = () => {
    this.setState(() => ({
      showDuplicateClusterAlert: false
    }))
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
      selectedShortcutFilter: null
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
    const { user, getUserTeams } = this.props

    this.order = order
    this.handleFilterChange({}, true)
    getUserTeams(user)
  }

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

  handleOnDelete = (e, options) => {
    const singleSelectedRow =
      options && options.singleSelectedRow ? options.singleSelectedRow : []
    const state = this.props.gridStateContext
    const entireMode = state.selection.isEntireRowsSelected

    const selectedRowsLength = entireMode
      ? this.props.listInfo.total - state.selection.excludedRows.length
      : state.selection.selectedRowIds.length
    const isSingleContact = singleSelectedRow.length === 1
    const isManyContacts = isSingleContact
      ? false
      : entireMode || selectedRowsLength > 1

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
    const state = this.props.gridStateContext
    const isSingleContact = singleSelectedRow.length === 1

    try {
      this.rowsUpdating(true)

      if (state.selection.isEntireRowsSelected && !isSingleContact) {
        const bulkDeleteParams = {
          users: this.props.viewAsUsers,
          searchText: this.state.searchInputValue,
          conditionOperator: this.props.conditionOperator,
          filters: this.props.filters,
          excludes: state.selection.excludedRows
        }

        await deleteContactsBulk(bulkDeleteParams)
        this.setState(() => ({
          showDuplicateClusterAlert: false,
          duplicateClusterCount: 0
        }))
        await this.reloadContacts()
      } else {
        const rows =
          state.selection.selectedRowIds.length > 0 && !isSingleContact
            ? state.selection.selectedRowIds
            : singleSelectedRow

        await this.props.deleteContacts(rows)
      }

      this.rowsUpdating(false)
      this.resetSelectedRows()
    } catch (error) {
      console.log(error)
    }
  }

  rowsUpdating = isRowsUpdating => this.setState({ isRowsUpdating })

  resetSelectedRows = () => {
    this.props.gridDispatchContext(resetRows())
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

  renderTabs = (props = {}) => {
    const { viewAsUsers, listInfo, activeSegment } = this.props

    return (
      <ContactsTabs
        handleFilterChange={this.handleFilterChange}
        handleChangeSavedSegment={this.handleChangeSavedSegment}
        handleResetShortcutFilter={() => {
          this.setState(() => ({
            selectedShortcutFilter: null
          }))
        }}
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
          isActive: this.state.selectedShortcutFilter !== null
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
          onChange: this.handleChangeOrder,
          currentOrder: this.order
        }}
        contactCount={listInfo.total || 0}
        users={viewAsUsers}
        activeSegment={activeSegment}
        {...props}
      />
    )
  }

  renderDuplicateAlert = () => {
    const { duplicateClusterCount } = this.state

    return (
      <Box mt={1.5}>
        <Alert
          severity="info"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={this.closeDupicateAlert}
            >
              <SvgIcon path={mdiClose} />
            </IconButton>
          }
        >
          <Box>
            You currently have {duplicateClusterCount} duplicate contacts,{' '}
            <NavigateDuplicate href="/dashboard/contacts/duplicates">
              manage them here.
            </NavigateDuplicate>
          </Box>
        </Alert>
      </Box>
    )
  }

  render() {
    const { props, state } = this
    const { list, viewAsUsers, isFetchingContacts, activeSegment } = this.props
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
      !state.searchInputValue &&
      (!activeSegment ||
        !activeSegment.filters ||
        activeSegment.filters.length === 0)

    const title = this.getHeaderTitle()
    const showImportAction = this.shouldShowImportAndCreateActions()
    const activeTag = this.getActiveTag()

    return (
      <PageLayout>
        <PageLayout.HeaderWithSearch
          title={title}
          onSearch={this.handleSearch}
          onCreateContact={this.onCreateContact}
          SearchInputProps={{
            placeholder: 'Search Contacts'
          }}
        >
          {!isZeroState && (
            <Box ml={1}>
              {activeSegment && activeSegment.is_editable && (
                <TouchReminder
                  value={activeSegment.touch_freq}
                  onChange={this.handleListTouchReminderUpdate}
                />
              )}
              {activeTag && activeTag.id && (
                <TouchReminder
                  value={activeTag.touch_freq}
                  onChange={this.handleTagTouchReminderUpdate}
                />
              )}
              {showImportAction && <ImportContactsButton />}
            </Box>
          )}
          <Box ml={1.5}>
            <ViewAs />
          </Box>
        </PageLayout.HeaderWithSearch>
        <PageLayout.Main>
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
          {isZeroState && <ZeroState onCreateContact={this.onCreateContact} />}
          {!isZeroState && !this.state.isShowingDuplicatesList && (
            <>
              {this.renderTabs()}
              {state.showDuplicateClusterAlert && this.renderDuplicateAlert()}
              <Box mt={2}>
                <Table
                  data={contacts}
                  order={this.order}
                  totalRows={props.listInfo.total || 0}
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
    viewAsUsers: viewAs(user)
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getContacts,
    fetchOAuthAccounts,
    searchContacts,
    deleteContacts,
    confirmation,
    setContactsListTextFilter,
    getContactsTags,
    updateTeamSetting,
    getUserTeams,
    updateSegment: updateFilterSegment
  })(ContactsList)
)
