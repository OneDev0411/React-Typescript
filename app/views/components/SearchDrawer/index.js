import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'

import _ from 'underscore'

import ActionButton from 'components/Button/ActionButton'

import Drawer from '../OverlayDrawer'
import Search from '../Grid/Search'
import Loading from '../../../components/Partials/Loading'

import { SelectedItems } from './SelectedItems'
import { SearchResultList } from './SearchResult'

import { DefaultItems } from './DefaultItems'

const initialState = {
  isSearching: false,
  searchResults: [],
  error: null
}

class SearchDrawer extends React.Component {
  state = {
    ...initialState,
    selectedItems: {}
  }

  handleSearch = async value => {
    if (value.length === 0) {
      return this.setState(initialState)
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
    this.searchInputRef.clear()

    this.props.onClose()
  }

  handleSelectItem = item => {
    if (this.props.multipleSelection) {
      return this.handleAddNewItem(item)
    }

    this.setState(initialState)
    this.searchInputRef.clear()

    this.props.onSelectItems({
      [item.id]: item
    })
  }

  handleSelectMultipleItems = () => {
    this.setState(initialState)
    this.searchInputRef.clear()

    this.props.onSelectItems(this.state.selectedItems)
  }

  handleClickOutside = () => {
    if (!this.props.multipleSelection) {
      return false
    }

    this.setState({
      searchResults: []
    })

    this.searchInputRef.clear()
  }

  handleAddNewItem = item => {
    const normalized = this.props.normalizeSelectedItem(item)

    this.setState(state => ({
      selectedItems: { ...state.selectedItems, [normalized.id]: normalized },
      searchResults: []
    }))

    this.searchInputRef.clear()
  }

  handleUpdateList = list => {
    this.setState({
      selectedItems: _.indexBy(list, 'id')
    })
  }

  get ShowFooter() {
    return this.props.multipleSelection
  }

  get DefaultList() {
    return this.props.defaultList.filter(item => {
      const normalized = this.props.normalizeSelectedItem(item)

      return !this.state.selectedItems[normalized.id]
    })
  }

  get SearchResults() {
    return this.state.searchResults.filter(
      item => !this.state.selectedItems[item.id]
    )
  }

  render() {
    const { isSearching } = this.state
    const { showLoadingIndicator } = this.props

    return (
      <Drawer
        isOpen={this.props.isOpen}
        showFooter={this.ShowFooter}
        onClose={this.handleClose}
      >
        <Drawer.Header title={this.props.title} />
        <Drawer.Body style={{ overflow: 'auto' }}>
          <Downshift
            render={({ getItemProps }) => (
              <div style={{ position: 'relative' }}>
                <Search
                  {...this.props.searchInputOptions}
                  onChange={this.handleSearch}
                  isSearching={isSearching || showLoadingIndicator}
                  inputRef={ref => (this.searchInputRef = ref)}
                  style={{
                    ...this.props.searchInputOptions.style,
                    margin: '1.5rem 0'
                  }}
                />

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
                  hasDefaultList={this.DefaultList.length > 0}
                  getItemProps={getItemProps}
                  onUpdateList={this.handleUpdateList}
                  ItemRow={this.props.ItemRow}
                  multipleSelection={this.props.multipleSelection}
                />

                <DefaultItems
                  isLoading={this.props.showLoadingIndicator}
                  searchResults={this.SearchResults}
                  defaultListTitle={this.props.defaultListTitle}
                  defaultItems={this.DefaultList}
                  getItemProps={getItemProps}
                  handleSelectItem={this.handleSelectItem}
                  ItemRow={this.props.ItemRow}
                  multipleSelection={this.props.multipleSelection}
                />
              </div>
            )}
          />
        </Drawer.Body>

        <Drawer.Footer
          style={{
            flexDirection: 'row-reverse'
          }}
        >
          {this.props.renderAction ? (
            this.props.renderAction({
              selectedItems: this.state.selectedItems,
              onClick: this.handleSelectMultipleItems
            })
          ) : (
            <ActionButton
              disabled={_.size(this.state.selectedItems) === 0}
              onClick={this.handleSelectMultipleItems}
            >
              {_.size(this.state.selectedItems)} Items Selected
            </ActionButton>
          )}
        </Drawer.Footer>
      </Drawer>
    )
  }
}

SearchDrawer.defaultProps = {
  showLoadingIndicator: false,
  searchInputOptions: {},
  defaultList: [],
  defaultListTitle: 'Add from list',
  multipleSelection: false
}

SearchDrawer.propTypes = {
  showLoadingIndicator: PropTypes.bool,
  multipleSelection: PropTypes.bool,
  searchInputOptions: PropTypes.object,
  searchFunction: PropTypes.func.isRequired,
  ItemRow: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  defaultList: PropTypes.array,
  defaultListTitle: PropTypes.string
}

export default SearchDrawer
