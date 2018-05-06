import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import _ from 'underscore'

import SearchInput from '../SearchInput'
import ContactItem from '../ContactItem'
import Loading from '../../../../../components/Partials/Loading'
import { extractUserInfoFromContact } from '../../../../../models/contacts'
import { searchContacts } from '../../../../../models/contacts/search-contacts'

const ContactsListContainer = styled.div`
  position: relative;
  height: calc(100vh - 172px);
  padding: 2rem 0;
  overflow-x: hidden;
  overflow-y: scroll;

  @media screen and (min-width: 48em) {
    height: 240px;
  }
`

const ContactsList = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`

const propTypes = {
  handleSelectedItem: PropTypes.func.isRequired
}

class Body extends Component {
  state = {
    items: [],
    isSearching: false
  }

  fetchRepository = _.debounce(async value => {
    try {
      this.setState({ isSearching: true })

      const response = await searchContacts(value)

      if (Array.isArray(response.data)) {
        this.setState({
          items: response.data
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      this.setState({ isSearching: false })
    }
  }, 300)

  handleOnChange = async event => {
    const { value } = event.target

    if (!value) {
      return
    }

    // call the debounce function
    this.fetchRepository(value)
  }

  handleItemToString = item => {
    if (!item) {
      return ''
    }

    const { display_name } = item

    return display_name || 'unknown'
  }

  selectedItemHandler = item =>
    this.props.handleSelectedItem(extractUserInfoFromContact(item))

  render() {
    const { items, isSearching } = this.state

    return (
      <Downshift
        itemToString={this.handleItemToString}
        render={({ getInputProps, getItemProps, highlightedIndex }) => (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ padding: '0 2rem' }}>
              <SearchInput
                style={{ marginBottom: '12px' }}
                inputProps={{
                  ...getInputProps({
                    onChange: this.handleOnChange,
                    placeholder: 'Search for a contact...'
                  })
                }}
              />
            </div>
            <ContactsListContainer>
              {isSearching && <Loading />}
              {!isSearching &&
                items.length > 0 && (
                  <ContactsList className="u-scrollbar--thinner">
                    {items.map((item, index) => (
                      <ContactItem
                        item={item}
                        key={item.id || `downshift_search_result_item_${index}`}
                        {...getItemProps({ item })}
                        onClickHandler={this.selectedItemHandler}
                        isHighlighted={highlightedIndex === index}
                      />
                    ))}
                  </ContactsList>
                )}
            </ContactsListContainer>
          </div>
        )}
      />
    )
  }
}

Body.propTypes = propTypes

export default Body
