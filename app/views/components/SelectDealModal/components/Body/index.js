import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import _ from 'underscore'

import { Item } from './Item'
import SearchInput from './SearchInput'
import Loading from '../../../../../components/Partials/Loading'
import { searchDeals } from '../../../../../models/Deal/search'
import {
  ListContainer,
  List
} from '../../../SelectContactModal/components/Body'

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
    const { defaultSearchFilter, isDrawer } = this.props
    const defaultInputValue =
      typeof defaultSearchFilter !== 'string' ? '' : defaultSearchFilter

    return (
      <Downshift
        itemToString={this.handleItemToString}
        defaultInputValue={defaultInputValue}
        onSelect={this.props.handleSelectedItem}
        render={({ getInputProps, getItemProps, highlightedIndex }) => (
          <div style={{ paddingTop: '1rem' }}>
            <div style={{ padding: isDrawer ? '0' : '0 1rem' }}>
              <SearchInput
                style={{ marginBottom: '1em' }}
                inputProps={{
                  ...getInputProps({
                    onChange: this.handleOnChange,
                    placeholder: 'Search for a deal...'
                  })
                }}
              />
            </div>
            <ListContainer isDrawer={isDrawer}>
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
                  <List className="u-scrollbar--thinner" isDrawer={isDrawer}>
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
