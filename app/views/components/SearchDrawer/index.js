import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import ClickOutside from 'react-click-outside'

import _ from 'underscore'

import ActionButton from 'components/Button/ActionButton'

import Drawer from '../OverlayDrawer'
import Search from '../Grid/Search'
import Loading from '../../../components/Partials/Loading'
import Alert from '../../../components/Pages/Dashboard/Partials/Alert'

import { Body } from './Body'
import { SelectedItems } from './SelectedItems'

import { ListContainer, ListTitle } from './styled'

const initialState = {
  isSearching: false,
  selectedItems: {},
  searchResults: [],
  error: null
}

class SearchDrawer extends React.Component {
  state = initialState

  handleSearch = async value => {
    if (value.length === 0) {
      return this.setState(state => ({
        initialState,
        selectedItems: state.selectedItems
      }))
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

  handleSelectMultipleListing = () => {
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

  handleAddNewItem = async item => {
    const normalized = await this.props.normalizeSelectedItem(item)

    this.setState(state => ({
      selectedItems: { ...state.selectedItems, [normalized.id]: normalized },
      searchResults: []
    }))

    this.searchInputRef.clear()
  }

  handleUpdateList = list => {
    list.map(item => console.log(item))

    this.setState({
      selectedItems: list
    })
  }

  get ShowFooter() {
    return this.props.multipleSelection
  }

  get DefaultList() {
    return this.props.defaultList.filter(item => {
      const id = item.type === 'deal' ? item.listing : item.id

      return !this.state.selectedItems[id]
    })
  }

  get SearchResults() {
    return this.state.searchResults.filter(
      item => !this.state.selectedItems[item.id]
    )
  }

  render() {
    const { isSearching, error } = this.state
    const { showLoadingIndicator } = this.props

    const listsSharedProps = {
      ItemRow: this.props.ItemRow,
      multipleSelection: this.props.multipleSelection
    }

    return (
      <Drawer
        isOpen={this.props.isOpen}
        showFooter={this.ShowFooter}
        onClose={this.handleClose}
      >
        <Drawer.Header title={this.props.title} />
        <Drawer.Body style={{ overflow: 'hidden' }}>
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

                {!showLoadingIndicator &&
                  this.SearchResults.length > 0 && (
                    <ClickOutside onClickOutside={this.handleClickOutside}>
                      <ListContainer asDropDown>
                        {error && (
                          <Alert
                            type={
                              error.type === 'error' ? error.type : 'warning'
                            }
                            message={error.message}
                          />
                        )}

                        <Body
                          isDropDown
                          getItemProps={getItemProps}
                          list={this.SearchResults}
                          handleSelectItem={this.handleSelectItem}
                          {...listsSharedProps}
                        />
                      </ListContainer>
                    </ClickOutside>
                  )}

                <SelectedItems
                  isLoading={this.props.showLoadingIndicator}
                  selectedItems={this.state.selectedItems}
                  hasDefaultList={this.DefaultList.length > 0}
                  getItemProps={getItemProps}
                  onUpdateList={this.handleUpdateList}
                  listsSharedProps={listsSharedProps}
                />

                {this.DefaultList.length > 0 && (
                  <ListContainer
                    style={{
                      marginTop: '1rem'
                    }}
                  >
                    <ListTitle>{this.props.defaultListTitle}</ListTitle>

                    <Body
                      showAddButton
                      getItemProps={getItemProps}
                      list={this.DefaultList}
                      handleSelectItem={this.handleSelectItem}
                      {...listsSharedProps}
                    />
                  </ListContainer>
                )}
              </div>
            )}
          />
        </Drawer.Body>

        <Drawer.Footer
          style={{
            flexDirection: 'row-reverse'
          }}
        >
          <ActionButton
            disabled={_.size(this.state.selectedItems) === 0}
            onClick={this.handleSelectMultipleListing}
          >
            Next ({_.size(this.state.selectedItems)} Listings Selected)
          </ActionButton>
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
  multipleSelection: false,
  onUpdateList: () => null
}

SearchDrawer.propTypes = {
  showLoadingIndicator: PropTypes.bool,
  multipleSelection: PropTypes.bool,
  searchInputOptions: PropTypes.object,
  searchFunction: PropTypes.func.isRequired,
  ItemRow: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  onSelectItem: PropTypes.func.isRequired,
  defaultList: PropTypes.array,
  defaultListTitle: PropTypes.string,
  onUpdateList: PropTypes.func
}

export default SearchDrawer
