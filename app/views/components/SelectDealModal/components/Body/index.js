import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import _ from 'underscore'

import { Item } from './Item'
import SearchInput from './SearchInput'
import Loading from '../../../../../components/Partials/Loading'
import { searchDeals } from '../../../../../models/Deal/search'

const ListContainer = styled.div`
  position: relative;
  height: calc(100vh - 172px);
  padding: 1rem 0;
  overflow-x: hidden;
  overflow-y: scroll;

  @media screen and (min-width: 48em) {
    height: 280px;
  }
`

const List = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`

const propTypes = {
  deals: PropTypes.arrayOf(PropTypes.shape),
  handleSelectedItem: PropTypes.func.isRequired
}

const defaultProps = {
  deals: []
}

class Body extends Component {
  state = {
    error: false,
    items: this.props.deals,
    isSearching: false
  }

  componentDidMount() {
    const { defaultSearchFilter } = this.props

    if (defaultSearchFilter) {
      this.search(defaultSearchFilter)
    }
  }

  search = _.debounce(async value => {
    if (!value) {
      return this.setState({ items: this.props.deals, error: false })
    }

    if (value.length <= 3) {
      return this.setState({ error: true })
    }

    try {
      this.setState({ isSearching: true, error: false })

      const items = await searchDeals(this.props.user, value)

      if (Array.isArray(items)) {
        this.setState({ items })
      }
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ isSearching: false })
    }
  }, 300)

  handleOnChange = async event => {
    // call the debounce function
    this.search(event.target.value)
  }

  handleItemToString = () => ''

  render() {
    const { items, isSearching } = this.state
    const { defaultSearchFilter } = this.props
    const defaultInputValue =
      typeof defaultSearchFilter !== 'string' ? '' : defaultSearchFilter

    return (
      <Downshift
        itemToString={this.handleItemToString}
        defaultInputValue={defaultInputValue}
        onSelect={this.props.handleSelectedItem}
        render={({ getInputProps, getItemProps, highlightedIndex }) => (
          <div style={{ paddingTop: '1rem' }}>
            <div style={{ padding: '0 1rem' }}>
              <SearchInput
                style={{ marginBottom: '1em' }}
                inputProps={{
                  ...getInputProps({
                    onChange: this.handleOnChange,
                    placeholder: 'Search for a contact...'
                  })
                }}
              />
            </div>
            <ListContainer>
              {isSearching && <Loading />}
              {!isSearching &&
                this.state.error && (
                  <div
                    style={{
                      marginTop: '1em',
                      textAlign: 'center'
                    }}
                  >
                    <h3>Please type in at least 4 characters to see results</h3>
                    <p>
                      So many deals, so little time. Search by address, MLS # or
                      agent name to narrow your results.
                    </p>
                  </div>
                )}
              {!isSearching &&
                items.length > 0 && (
                  <List className="u-scrollbar--thinner">
                    {items.map((item, index) => (
                      <Item
                        item={item}
                        key={item.id || `downshift_search_result_item_${index}`}
                        {...getItemProps({ item })}
                        onClickHandler={this.props.handleSelectedItem}
                        isHighlighted={highlightedIndex === index}
                      />
                    ))}
                  </List>
                )}
            </ListContainer>
          </div>
        )}
      />
    )
  }
}

Body.propTypes = propTypes
Body.defaultProps = defaultProps

export default Body
