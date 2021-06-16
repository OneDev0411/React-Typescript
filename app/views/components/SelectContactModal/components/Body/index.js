import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import _ from 'underscore'

import { searchContacts } from 'models/contacts/search-contacts'

import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import SearchInput from '../SearchInput'
import ContactItem from '../ContactItem'
import { viewAs } from '../../../../../utils/user-teams'
import Loading from '../../../../../components/Partials/Loading'

import Alert from '../../../../../components/Pages/Dashboard/Partials/Alert'

import { ListContainer, List } from './styled'

const propTypes = {
  defaultSearchFilter: PropTypes.string,
  handleSelectedItem: PropTypes.func.isRequired,
  isSearchDisabled: PropTypes.bool
}

const defaultProps = {
  isSearchDisabled: false,
  defaultSearchFilter: ''
}

class Body extends Component {
  state = {
    isLoading: true,
    list: []
  }

  componentDidMount() {
    this.search(this.props.defaultSearchFilter)
  }

  search = _.debounce(async value => {
    try {
      this.setState({ isLoading: true })

      const response = await searchContacts(
        value,
        undefined,
        undefined,
        this.props.viewAsUsers
      )

      this.setState({
        isLoading: false,
        list: normalizeContactAttribute(response)
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }, 300)

  handleOnChange = async event => {
    // call the debounce function
    this.search(event.target.value)
  }

  handleItemToString = item => {
    if (!item) {
      return ''
    }

    const { display_name } = item

    return display_name || 'unknown'
  }

  render() {
    const { list, isLoading } = this.state
    const { defaultSearchFilter, isDrawer } = this.props
    const defaultInputValue =
      typeof defaultSearchFilter !== 'string' ? '' : defaultSearchFilter

    return (
      <Downshift
        itemToString={this.handleItemToString}
        defaultInputValue={defaultInputValue}
        render={({ getInputProps, getItemProps, highlightedIndex }) => (
          <div
            style={{
              paddingTop: isDrawer ? '1.5rem' : '1rem',
              margin: isDrawer ? '0 -1.5rem' : 0
            }}
          >
            {!this.props.isSearchDisabled && (
              <div
                style={{
                  marginBottom: isDrawer ? '1.5rem' : '1rem',
                  padding: isDrawer ? '0 1.5rem' : '0 1rem'
                }}
              >
                <SearchInput
                  inputProps={{
                    ...getInputProps({
                      onChange: this.handleOnChange,
                      placeholder: 'Search for a contact...',
                      'data-tour-id': 'search-contact'
                    })
                  }}
                />
              </div>
            )}
            <ListContainer isDrawer={isDrawer}>
              <List isDrawer={isDrawer} className="u-scrollbar--thinner">
                {isLoading ? (
                  <Loading />
                ) : (
                  list.map((item, index) => (
                    <ContactItem
                      item={item}
                      isDrawer={isDrawer}
                      key={item.id || `downshift_search_result_item_${index}`}
                      {...getItemProps({ item })}
                      onClickHandler={this.props.handleSelectedItem}
                      isHighlighted={highlightedIndex === index}
                    />
                  ))
                )}

                {!isLoading && list.length === 0 && (
                  <Alert
                    type="warning"
                    style={{
                      margin: isDrawer ? '0 1.5rem' : '0 1rem'
                    }}
                    message="No Result"
                  />
                )}
              </List>
            </ListContainer>
          </div>
        )}
      />
    )
  }
}

Body.propTypes = propTypes
Body.defaultProps = defaultProps

export default connect(({ user }) => ({ viewAsUsers: viewAs(user) }))(Body)
