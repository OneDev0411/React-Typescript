import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'

import _ from 'underscore'

import ActionButton from 'components/Button/ActionButton'

import Drawer from '../OverlayDrawer'
import Search from '../Grid/Search'
import Loading from '../../../components/Partials/Loading'
import Alert from '../../../components/Pages/Dashboard/Partials/Alert'

import { Body } from './Body'

import { ResultsContainer } from './styled'

const initialState = {
  isSearching: false,
  selectedRows: {},
  list: [],
  error: null
}

class SearchDrawer extends React.Component {
  state = initialState

  handleSearch = async value => {
    if (value.length === 0) {
      return this.setState(initialState)
    }

    try {
      this.setState({
        isSearching: true,
        error: null,
        list: []
      })

      const list = await this.props.searchFunction(value)

      this.setState({
        list,
        error: list.length === 0 && {
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
      this.handleClickCheckbox(item)

      return
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

    console.log(this.state.selectedRows)
    this.props.onSelectItems(this.state.selectedRows)
  }

  handleClickCheckbox = item => {
    let nextState = {}

    if (this.state.selectedRows[item.id]) {
      nextState = _.omit(this.state.selectedRows, row => row.id === item.id)
    } else {
      nextState = { ...this.state.selectedRows, [item.id]: item }
    }

    this.setState({ selectedRows: nextState })
  }

  get List() {
    const { list } = this.state

    return this.state.isSearching || this.state.error || list.length > 0
      ? list
      : this.props.initialList
  }

  render() {
    const { isSearching, error } = this.state
    const { showLoadingIndicator } = this.props

    console.log('>>>', this.List)

    return (
      <Drawer
        isOpen={this.props.isOpen}
        showFooter={this.props.multipleSelection}
        onClose={this.handleClose}
      >
        <Drawer.Header title={this.props.title} />
        <Drawer.Body style={{ overflow: 'hidden' }}>
          <Downshift
            render={({ getItemProps, highlightedIndex }) => (
              <div>
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

                <ResultsContainer>
                  {error && (
                    <Alert
                      type={error.type === 'error' ? error.type : 'warning'}
                      message={error.message}
                    />
                  )}

                  {!showLoadingIndicator && (
                    <Body
                      isSortable={this.props.isSortable}
                      getItemProps={getItemProps}
                      highlightedIndex={highlightedIndex}
                      ItemRow={this.props.ItemRow}
                      list={this.List}
                      multipleSelection={this.props.multipleSelection}
                      selectedRows={this.state.selectedRows}
                      handleClickCheckbox={this.handleClickCheckbox}
                      handleSelectItem={this.handleSelectItem}
                      onSortChange={this.props.onSortChange}
                    />
                  )}
                </ResultsContainer>
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
            disabled={_.size(this.state.selectedRows) === 0}
            onClick={this.handleSelectMultipleListing}
          >
            Next ({_.size(this.state.selectedRows)} Listings Selected)
          </ActionButton>
        </Drawer.Footer>
      </Drawer>
    )
  }
}

SearchDrawer.defaultProps = {
  showLoadingIndicator: false,
  searchInputOptions: {},
  initialList: [],
  isSortable: false,
  multipleSelection: false,
  onSortChange: () => null
}

SearchDrawer.propTypes = {
  showLoadingIndicator: PropTypes.bool,
  isSortable: PropTypes.bool,
  multipleSelection: PropTypes.bool,
  searchInputOptions: PropTypes.object,
  searchFunction: PropTypes.func.isRequired,
  ItemRow: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  onSelectItem: PropTypes.func.isRequired,
  initialList: PropTypes.array,
  onSortChange: PropTypes.func
}

export default SearchDrawer
