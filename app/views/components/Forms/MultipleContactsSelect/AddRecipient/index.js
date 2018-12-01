import React from 'react'
import { connect } from 'react-redux'

import Downshift from 'downshift'
import _ from 'underscore'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { getSegments, isListFetched } from 'reducers/filter-segments'

import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { getSavedSegments } from 'actions/filter-segments/get-saved-segment'

import { searchContacts } from '../../../../../models/contacts/search-contacts'
import { getContactAttribute } from '../../../../../models/contacts/helpers/get-contact-attribute'

import { normalizeContactAttribute } from '../../../../../store_actions/contacts/helpers/normalize-contacts'

import { selectDefinitionByName } from '../../../../../reducers/contacts/attributeDefs'

import {
  SearchInput,
  SearchInputContainer,
  SearchResults,
  Title,
  SectionSeparator
} from './styled'

import ContactItem from '../../../SelectContactModal/components/ContactItem'
import { ListRow } from './ListRow'

const initialState = {
  isLoading: false,
  isListMenuOpen: false,
  searchText: '',
  list: [],
  filteredTags: [],
  filteredList: []
}

class AddRecipient extends React.Component {
  constructor(props) {
    super(props)

    this.state = initialState
    this.search = _.debounce(this.search, 500)
  }

  componentDidMount() {
    const fetchTags = !this.props.tagsIsFetching

    if (fetchTags) {
      this.props.getContactsTags()
    }

    if (this.props.isSegmentsList === false) {
      this.props.getSavedSegments('contacts')
    }
  }

  isEmail = (email = '') => {
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return regular.test(email.trim())
  }

  handleSelectNewContact = contact => {
    let newRecipient

    const isEmailExists = this.props.input.value.some(
      recipient => recipient.email === contact.summary.email
    )

    if (!isEmailExists && contact.id && contact.summary.email) {
      const emails = getContactAttribute(
        contact,
        selectDefinitionByName(this.props.attributeDefs, 'email')
      )

      newRecipient = {
        contactId: contact.id,
        name: contact.summary.display_name,
        avatar: contact.summary.profile_image_url,
        email: contact.summary.email,
        emails: emails.map(email => email.text),
        type: 'contact'
      }

      this.props.input.onChange([...this.props.input.value, newRecipient])
    }

    if (!isEmailExists && !contact.id) {
      newRecipient = {
        name: contact.summary.display_name,
        email: contact.summary.email,
        emails: [],
        type: 'contact'
      }

      this.props.input.onChange([...this.props.input.value, newRecipient])
    }

    this.setState(initialState)
  }

  handleSelectNewListItem = (item, type) => {
    let newRecipient

    const isItemExists = this.props.input.value.some(
      recipient => recipient.name === item.text
    )

    if (!isItemExists) {
      newRecipient = {
        [`${type}Id`]: item.id,
        name: type === 'tag' ? item.text : item.name,
        type
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

      const list = normalizeContactAttribute(response)

      if (list.length === 0 && this.isEmail(value)) {
        list.push({
          summary: {
            display_name: value.split('@')[0],
            email: value
          }
        })
      }

      const regEx = new RegExp(value, 'i')

      const filteredTags = this.props.existingTags.filter(({ text }) =>
        text.match(regEx)
      )
      const filteredList = this.props.segmentsList.filter(
        ({ name, id }) => name.match(regEx) && id !== 'default'
      )

      this.setState({
        isLoading: false,
        isListMenuOpen: true,
        list,
        filteredTags,
        filteredList
      })
    } catch (e) {
      console.log(e)
      this.setState({ isLoading: false, isListMenuOpen: false })
    }
  }

  render() {
    return (
      <Downshift
        isOpen={this.state.isListMenuOpen}
        onOuterClick={() => this.setState({ isListMenuOpen: false })}
        render={({ isOpen, getInputProps, getItemProps }) => (
          <div style={{ position: 'relative' }}>
            <SearchInputContainer textLength={this.state.searchText.length}>
              <SearchInput
                {...getInputProps({
                  value: this.state.searchText,
                  onChange: this.handleSearchContact,
                  placeholder: 'Add new recipient',
                  readOnly: this.state.isLoading
                })}
              />

              {this.state.isLoading && <i className="fa fa-spin fa-spinner" />}
            </SearchInputContainer>

            {isOpen && (
              <SearchResults>
                {this.state.filteredTags.length > 0 && (
                  <React.Fragment>
                    <Title>Tags</Title>
                    {this.state.filteredTags.map((tag, index) => (
                      <ListRow
                        key={tag.id || index}
                        text={tag.text}
                        type="tag"
                        onClick={() => this.handleSelectNewListItem(tag, 'tag')}
                      />
                    ))}
                    <SectionSeparator />
                  </React.Fragment>
                )}

                {this.state.filteredList.length > 0 && (
                  <React.Fragment>
                    <Title>Lists</Title>
                    {this.state.filteredList.map((list, index) => (
                      <ListRow
                        key={list.id || index}
                        text={list.name}
                        member_count={list.member_count}
                        type="list"
                        onClick={() =>
                          this.handleSelectNewListItem(list, 'list')
                        }
                      />
                    ))}
                    <SectionSeparator />
                  </React.Fragment>
                )}
                {this.state.list.length > 0 && <Title>Contacts</Title>}
                {this.state.list
                  .filter(item => !!item.summary.email)
                  .map((item, index) => (
                    <ContactItem
                      key={item.id || index}
                      item={item}
                      {...getItemProps({ item })}
                      summary={item.summary.email || ''}
                      onClickHandler={this.handleSelectNewContact}
                      isHighlighted={false}
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
  const existingTags = selectTags(contacts.tags)
  const tagsIsFetching = isFetchingTags(contacts.tags)
  const segmentsList = getSegments(contacts.filterSegments, 'contacts')

  return {
    contacts: contacts.list,
    attributeDefs: contacts.attributeDefs,
    existingTags,
    tagsIsFetching,
    segmentsList,
    isSegmentsList: isListFetched(contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  { getContactsTags, getSavedSegments }
)(AddRecipient)
