import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import SearchInput from '../SearchInput'
import ContactItem from '../ContactItem'
import NoContacts from '../NoContacts'

function filterKeywords({ item, keyword }) {
  if (!keyword || keyword.length < 2) {
    return true
  }

  return Object.keys(item).some(fieldName => {
    const fieldValue = item[fieldName]

    if (typeof fieldValue === 'string') {
      return fieldValue.toLowerCase().includes(keyword.toLowerCase())
    }
  })
}

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
  handleSelectedItem: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape).isRequired
}

class Body extends Component {
  constructor(props) {
    super(props)

    const { list } = this.props

    this.state = {
      items: list || []
    }
  }

  handleItemToString = item => {
    if (!item) {
      return ''
    }

    const { display_name } = item

    return display_name || 'unknown'
  }

  render() {
    const { items } = this.state
    const { handleSelectedItem, handleAddManually } = this.props

    return (
      <Downshift
        onChange={handleSelectedItem}
        itemToString={this.handleItemToString}
        render={({
          getInputProps,
          getItemProps,
          inputValue,
          highlightedIndex
        }) => (
          <div style={{ paddingTop: '2rem' }}>
            <div style={{ padding: '0 2rem' }}>
              <SearchInput
                style={{ marginBottom: '12px' }}
                inputProps={{
                  ...getInputProps({
                    disabled: items.length === 0,
                    placeholder: 'Search for a contact...'
                  })
                }}
              />
            </div>
            <ContactsListContainer>
              {items.length > 0 ? (
                <ContactsList className="u-scrollbar--thinner">
                  {items
                    .filter(item =>
                      filterKeywords({ item, keyword: inputValue })
                    )
                    .map((item, index) => (
                      <ContactItem
                        item={item}
                        key={item.id || `downshift_search_result_item_${index}`}
                        {...getItemProps({ item })}
                        onClickHandler={handleSelectedItem}
                        isHighlighted={highlightedIndex === index}
                      />
                    ))}
                </ContactsList>
              ) : (
                <NoContacts handleAddManually={handleAddManually} />
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
