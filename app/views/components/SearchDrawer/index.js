import React from 'react'
import Downshift from 'downshift'
import PropTypes from 'prop-types'

import Drawer from '../OverlayDrawer'
import Search from '../Grid/Search'
import Loading from '../../../components/Partials/Loading'
import Alert from '../../../components/Pages/Dashboard/Partials/Alert'

import { ResultsContainer } from './styled'

const initialState = {
  isSearching: false,
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
    this.setState(initialState)
    this.searchInputRef.clear()

    this.props.onSelectItem(item)
  }

  get List() {
    const { list } = this.state

    return this.state.isSearching || this.state.error || list.length > 0
      ? list
      : this.props.initialList
  }

  render() {
    const { isSearching, error } = this.state
    const { showLoadingIndicator, ItemRow } = this.props

    return (
      <Drawer
        isOpen={this.props.isOpen}
        showFooter={false}
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

                  {!showLoadingIndicator &&
                    this.List.map((item, index) => (
                      <ItemRow
                        key={index}
                        item={item}
                        isHighlighted={highlightedIndex === index}
                        {...getItemProps({
                          item,
                          onClick: () => this.handleSelectItem(item)
                        })}
                      />
                    ))}
                </ResultsContainer>
              </div>
            )}
          />
        </Drawer.Body>
      </Drawer>
    )
  }
}

SearchDrawer.defaultProps = {
  showLoadingIndicator: false,
  searchInputOptions: {}
}

SearchDrawer.propTypes = {
  showLoadingIndicator: PropTypes.bool,
  searchInputOptions: PropTypes.object,
  searchFunction: PropTypes.func.isRequired,
  ItemRow: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  onSelectItem: PropTypes.func.isRequired
}

export default SearchDrawer
