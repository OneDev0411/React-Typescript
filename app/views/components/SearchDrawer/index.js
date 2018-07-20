import React from 'react'
import Downshift from 'downshift'

import Drawer from '../OverlayDrawer'
import Search from '../Grid/Search'
import Loading from '../../../components/Partials/Loading'

import { ResultsContainer, ErrorMessage } from './styled'

const initialState = {
  isSearching: false,
  list: [],
  error: null
}

export default class SearchDrawer extends React.Component {
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
          message: 'No Result Found'
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

  render() {
    const { isSearching, error } = this.state
    const { showLoadingIndicator, ItemRow, onSelectItem } = this.props

    return (
      <Drawer isOpen={this.props.isOpen} showFooter={false}>
        <Drawer.Header title={this.props.title} />
        <Drawer.Body style={{ overflow: 'hidden' }}>
          <Downshift
            render={({ getItemProps, highlightedIndex }) => (
              <div>
                <Search
                  {...this.props.searchInputOptions}
                  onChange={this.handleSearch}
                  isSearching={isSearching || showLoadingIndicator}
                  style={{
                    ...this.props.searchInputOptions.style,
                    margin: '16px'
                  }}
                />

                {(isSearching || showLoadingIndicator) && <Loading />}

                <ResultsContainer>
                  {error && (
                    <ErrorMessage type={error.type}>
                      {error.message}
                    </ErrorMessage>
                  )}

                  {!showLoadingIndicator &&
                    this.state.list.map((item, index) => (
                      <ItemRow
                        key={index}
                        item={item}
                        isHighlighted={highlightedIndex === index}
                        {...getItemProps({
                          item,
                          onClick: () => onSelectItem(item)
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
