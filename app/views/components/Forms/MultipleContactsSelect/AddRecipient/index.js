import React from 'react'
import { connect } from 'react-redux'

import Downshift from 'downshift'
import _ from 'underscore'

import { searchContacts } from '../../../../../models/contacts/search-contacts'
import { normalizeContactAttribute } from '../../../../../store_actions/contacts/helpers/normalize-contacts'

import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'
import { getContactAttribute } from '../../../../../models/contacts/helpers/get-contact-attribute'

import { SearchInput, SearchInputContainer, SearchResults } from './styled'

import ContactItem from '../../../SelectContactModal/components/ContactItem'

const initialState = {
  isLoading: false,
  isListMenuOpen: false,
  searchText: '',
  list: []
}

class AddRecipient extends React.Component {
  constructor(props) {
    super(props)

    this.state = initialState
    this.search = _.debounce(this.search, 500)
  }

  handleSelectNewContact = contact => {
    const isEmailExists = this.props.input.value.some(
      recipient => recipient.email === contact.summary.email
    )

    if (!isEmailExists && contact.summary.email) {
      const emails = getContactAttribute(
        contact,
        selectDefinitionByName(this.props.attributeDefs, 'email')
      )

      const newRecipient = {
        contactId: contact.id,
        name: contact.summary.display_name,
        avatar: contact.summary.profile_image_url,
        email: contact.summary.email,
        emails: emails.map(email => email.text)
      }

      this.props.input.onChange([...this.props.input.value, newRecipient])
    }

    this.setState(initialState)
  }

  handleSearchContact = e => {
    const { value } = e.target

    this.setState({
      searchText: value
    })

    this.search(value)
  }

  search = async value => {
    if (value.length === 0) {
      return this.setState(initialState)
    }

    try {
      this.setState({ isLoading: true, isListMenuOpen: false })

      const response = await searchContacts(value)

      this.setState({
        isLoading: false,
        isListMenuOpen: true,
        list: normalizeContactAttribute(response)
      })
    } catch (error) {
      this.setState({ isLoading: false, isListMenuOpen: false })
    }
  }

  render() {
    return (
      <Downshift
        isOpen={this.state.isListMenuOpen}
        onOuterClick={() => this.setState({ isListMenuOpen: false })}
        render={({ isOpen, getInputProps, getItemProps, highlightedIndex }) => (
          <div style={{ position: 'relative' }}>
            <SearchInputContainer>
              <SearchInput
                {...getInputProps({
                  value: this.state.searchText,
                  onChange: this.handleSearchContact,
                  placeholder: 'Add new recipient',
                  readonly: this.state.isLoading
                })}
              />

              {this.state.isLoading && <i className="fa fa-spin fa-spinner" />}
            </SearchInputContainer>

            {isOpen && (
              <SearchResults>
                {this.state.list
                  .filter(item => !!item.summary.email)
                  .map((item, index) => (
                    <ContactItem
                      key={item.id || index}
                      item={item}
                      {...getItemProps({ item })}
                      summary={item.summary.email || ''}
                      onClickHandler={this.handleSelectNewContact}
                      isHighlighted={highlightedIndex === index}
                    />
                  ))}
              </SearchResults>
            )}
          </div>
        )}
      />
    )
  }
}

function mapStateToProps({ contacts }) {
  return { contacts: contacts.list, attributeDefs: contacts.attributeDefs }
}

export default connect(mapStateToProps)(AddRecipient)
