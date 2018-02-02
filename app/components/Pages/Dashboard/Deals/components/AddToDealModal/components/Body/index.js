import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Downshift from 'downshift'
import SearchInput from '../SearchInput'
import ContactItem from '../ContactItem'
import { extractUserInfoFromContact } from '../../../../../../../../models/Contact'

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
  contactsList: PropTypes.array.isRequired
}

class Body extends Component {
  constructor(props) {
    super(props)

    const { contactsList } = this.props

    this.state = {
      items: contactsList || []
    }

    this.onChangeHandler = this.onChangeHandler.bind(this)
  }

  onChangeHandler = item => {
    this.props.selectedItemHandler(extractUserInfoFromContact(item))
  }

  render() {
    const { items } = this.state
    const { selectedItemHandler } = this.props

    return (
      <Downshift
        onChange={this.onChangeHandler}
        itemToString={({ display_name }) => display_name}
        render={({
 getInputProps, getItemProps, inputValue, highlightedIndex
}) => (
  <div style={{ paddingTop: '2rem' }}>
    <div style={{ padding: '0 2rem' }}>
      <SearchInput
        style={{ marginBottom: '12px' }}
        inputProps={{
                  ...getInputProps({
                    placeholder: 'Enter a keyword for searching in your contacts'
                  })
                }}
      />
    </div>
    {items && (
    <ContactsListContainer>
      <ContactsList className="u-scrollbar--thinner">
        {items
                    .filter(item =>
                      filterKeywords({ keyword: inputValue, contact: item }))
                    .map((item, index) => (
                      <ContactItem
                        item={item}
                        key={item.id}
                        {...getItemProps({ item })}
                        onClickHandler={selectedItemHandler}
                        isHighlighted={highlightedIndex === index}
                      />
                    ))}
      </ContactsList>
    </ContactsListContainer>
            )}
  </div>
        )}
      />
    )
  }
}

Body.propTypes = propTypes

export default Body

function filterKeywords({ keyword, contact }) {
  if (!keyword || keyword.length < 2) {
    return true
  }

  const user = extractUserInfoFromContact(contact)

  return Object.keys(user).some(fieldName => {
    const fieldValue = user[fieldName]

    if (typeof fieldValue === 'string') {
      return fieldValue.toLowerCase().includes(keyword.toLowerCase())
    }
  })
}
