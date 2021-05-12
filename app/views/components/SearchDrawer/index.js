import React, { createRef } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import _ from 'underscore'
import { Box } from '@material-ui/core'

import { SearchInput } from 'components/GlobalHeaderWithSearch'

import Drawer from '../OverlayDrawer'
import Loading from '../../../components/Partials/Loading'
import { SelectedItems } from './SelectedItems'
import { SearchResultList } from './SearchResult'
import { DefaultItems } from './DefaultItems'
import Footer from './components/Footer'

const initialState = {
  isSearching: false,
  searchResults: [],
  error: null,
  isSearchInputEverClicked: false
}

/**
 * Notes and known issues:
 * - Doesn't clean up on drawer close and re-open, needs conditional rendering
 * which kills animation and is misleading also as we have an isOpen prop
 * - search filter is not sticky
 * - item renderer component in autocompletion is the same as in the list
 * - multiple selection is only supported with autocompletion, not filtering
 * - whether item is selected or not is not passed to renderer as prop
 */
class SearchDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
      selectedItems: props.defaultSelectedItems || {}
    }
    this.inputRef = createRef()
  }

  handleSearch = async (_, value) => {
    if (value.length === 0) {
      return this.setState(initialState)
    }

    if (value.length < 3) {
      return
    }

    try {
      this.setState({
        isSearching: true,
        error: null,
        searchResults: []
      })

      const searchResults = await this.props.searchFunction(value)

      this.setState({
        searchResults,
        error: searchResults.length === 0 && {
          type: 'warning',
          message: 'No MLS Listing Found'
        }
      })
    } catch (e) {
      this.setState({
        error: {
          type: 'error',
          message: e.response ? e.response.body.message : e.message
        }
      })
    } finally {
      this.setState({
        isSearching: false
      })
    }
  }

  handleClose = () => {
    this.setState(initialState)
    this.inputRef.current.clear()
    this.props.onClose()
  }

  handleClear = () => {
    this.setState(initialState)
  }

  handleSelectItem = item => {
    if (this.props.multipleSelection) {
      return this.handleAddNewItem(item)
    }

    this.setState(initialState)
    this.inputRef.current.clear()
    this.props.onSelectItems({
      [item.id]: item
    })
  }

  handleSelectMultipleItems = () => {
    this.setState(initialState)
    this.inputRef.current.clear()
    this.props.onSelectItems(this.state.selectedItems)
  }

  handleClickOutside = () => {
    if (!this.props.multipleSelection) {
      return false
    }

    this.setState({
      searchResults: []
    })
    this.inputRef.current.clear()
  }

  handleClickSearchInput = () => {
    if (this.state.isSearchInputEverClicked) {
      return
    }

    this.setState({ isSearchInputEverClicked: true })
  }

  handleAddNewItem = item => {
    const normalized = this.props.normalizeSelectedItem(item)

    this.setState(state => ({
      selectedItems: { ...state.selectedItems, [normalized.id]: normalized },
      searchResults: []
    }))
    this.inputRef.current.clear()
  }

  handleUpdateList = list => {
    this.setState({
      selectedItems: _.indexBy(list, 'id')
    })
  }

  getNormalizedDefaultLists = () => {
    return this.props.defaultLists
      .map(defaultList => {
        return {
          title: defaultList.title,
          items: defaultList.items.filter(item => {
            const normalized = this.props.normalizeSelectedItem(item)

            return !this.state.selectedItems[normalized.id]
          })
        }
      })
      .filter(defaultList => defaultList.items.length > 0)
  }

  get SearchResults() {
    return this.state.searchResults.filter(
      item => !this.state.selectedItems[item.id]
    )
  }

  render() {
    const { isSearching } = this.state
    const { showLoadingIndicator } = this.props
    const selectedItemsCount = Object.keys(this.state.selectedItems).length
    const normalizedDefaultLists = this.getNormalizedDefaultLists()
    const hasDefaultLists = normalizedDefaultLists.some(
      defaultList => defaultList.items.length > 0
    )

    return (
      <Drawer open={this.props.isOpen} onClose={this.handleClose}>
        <Drawer.Header title={this.props.title} />
        <Drawer.Body style={{ overflowX: 'hidden' }}>
          <Downshift
            render={({ getItemProps }) => (
              <div style={{ position: 'relative' }}>
                <Box py={2}>
                  <SearchInput
                    fullWidth
                    ref={this.inputRef}
                    onClick={this.handleClickSearchInput}
                    onChange={this.handleSearch}
                    onClear={this.handleClear}
                    {...this.props.searchInputOptions}
                  />
                </Box>
                {this.props.renderSearchNotices &&
                  this.state.isSearchInputEverClicked &&
                  this.props.renderSearchNotices()}
                {(isSearching || showLoadingIndicator) && <Loading />}
                <SearchResultList
                  isLoading={this.props.showLoadingIndicator}
                  searchResults={this.SearchResults}
                  error={this.state.error}
                  getItemProps={getItemProps}
                  handleSelectItem={this.handleSelectItem}
                  handleClickOutside={this.handleClickOutside}
                  ItemRow={this.props.ItemRow}
                  multipleSelection={this.props.multipleSelection}
                />
                <SelectedItems
                  isLoading={this.props.showLoadingIndicator}
                  selectedItems={this.state.selectedItems}
                  hasDefaultList={hasDefaultLists}
                  getItemProps={getItemProps}
                  onUpdateList={this.handleUpdateList}
                  ItemRow={this.props.ItemRow}
                  multipleSelection={this.props.multipleSelection}
                />
                <DefaultItems
                  isLoading={this.props.showLoadingIndicator}
                  searchResults={this.SearchResults}
                  defaultLists={normalizedDefaultLists}
                  getItemProps={getItemProps}
                  handleSelectItem={this.handleSelectItem}
                  ItemRow={this.props.ItemRow}
                  multipleSelection={this.props.multipleSelection}
                />
              </div>
            )}
          />
        </Drawer.Body>
        <Footer
          multipleSelection={
            this.props.multipleSelection || this.props.forceRenderFooter
          }
          selectedItemsCount={selectedItemsCount}
          renderAction={this.props.renderAction}
          handleSelectMultipleItems={this.handleSelectMultipleItems}
        />
      </Drawer>
    )
  }
}

SearchDrawer.defaultProps = {
  showLoadingIndicator: false,
  searchInputOptions: {},
  defaultLists: [],
  multipleSelection: false,
  forceRenderFooter: false
}
SearchDrawer.propTypes = {
  showLoadingIndicator: PropTypes.bool,
  multipleSelection: PropTypes.bool,
  searchInputOptions: PropTypes.object,
  searchFunction: PropTypes.func.isRequired,
  ItemRow: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  defaultLists: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.array
    })
  ),
  forceRenderFooter: PropTypes.bool
}

export default SearchDrawer
