import React from 'react'
import { connect } from 'react-redux'
import Fuse from 'fuse.js'

import Downshift from 'downshift'
import _ from 'underscore'

import { isFetchingTags, selectTags } from 'reducers/contacts/tags'
import { getSegments, isListFetched } from 'reducers/filter-segments'

import { getContactsTags } from 'actions/contacts/get-contacts-tags'
import { getSavedSegments } from 'actions/filter-segments/get-saved-segment'

import { searchContacts } from 'models/contacts/search-contacts'
import { getContactAttribute } from 'models/contacts/helpers/get-contact-attribute'

import { normalizeContactAttribute } from 'actions/contacts/helpers/normalize-contacts'

import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'

import {
  SearchInput,
  SearchInputContainer,
  SearchResults,
  Title,
  SectionSeparator
} from './styled'

import ContactItem from '../../../SelectContactModal/components/ContactItem'
import { ListItem } from './ListItem'

const initialState = {
  isContactsLoading: false,
  forceCloseSuggestions: false,
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
    if (!this.props.isLoadingTags) {
      this.props.getContactsTags()
    }

    if (!this.props.isListFetched) {
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
        data_type: 'contact'
      }

      this.props.input.onChange([...this.props.input.value, newRecipient])
    }

    if (!isEmailExists && !contact.id) {
      newRecipient = {
        name: contact.summary.display_name,
        email: contact.summary.email,
        emails: [],
        data_type: 'email'
      }

      this.props.input.onChange([...this.props.input.value, newRecipient])
    }

    this.setState(initialState)
  }

  handleSelectNewListItem = (item, type) => {
    const isItemExists = this.props.input.value.some(
      recipient => recipient.data_type === type && item.id === recipient.id
    )

    if (isItemExists === false) {
      const contact = {
        ...item,
        data_type: type
      }

      this.props.input.onChange([...this.props.input.value, contact])
    }

    this.setState(initialState)
  }

  // We have two methods for searching and we are searching in parallel
  // For searching in contacts we need to use server and for searching
  // In tags & segments list we can get them once and search in them locally
  handleSearchContact = e => {
    const { value } = e.target

    // Reset the state (clearing the inputs) when the value is empty
    if (value.length === 0) {
      return this.setState(initialState)
    }

    this.setState({
      searchText: value,
      forceCloseSuggestions: false
    })

    // We are searching for tags/list and contacts from server in parallel
    // Because we can show the results instantly for tags/list
    this.handleSearchInTagsAndLists(value)
    this.search(value)
  }

  handleInputBlur = () => {
    const input = this.state.searchText

    if (!this.isEmail(input)) {
      return false
    }

    const contact = {
      summary: {
        display_name: input.split('@')[0],
        email: input
      }
    }

    this.handleSelectNewContact(contact)
  }

  // Searching in tags & lists locally
  handleSearchInTagsAndLists = value => {
    let tagsFuseOptions = {
      keys: ['text'],
      threshold: 0.3
    }

    let segmentsFuseOptions = {
      keys: ['name'],
      threshold: 0.3
    }

    // Tags result
    let filteredTags = new Fuse(this.props.tags, tagsFuseOptions)
      .search(value)
      .slice(0, 5)

    // Segments result
    let filteredList = new Fuse(this.props.segmentsList, segmentsFuseOptions)
      .search(value)
      .slice(0, 5)

    this.setState({
      filteredTags,
      filteredList
    })
  }

  // Searching in contacts remotely by connecting to the server.
  search = async value => {
    try {
      this.setState({ isContactsLoading: true })

      const response = await searchContacts(value)

      let list = normalizeContactAttribute(response)

      if (list.length === 0 && this.isEmail(value)) {
        list.push({
          summary: {
            display_name: value.split('@')[0],
            email: value
          }
        })
      }

      // This is a workaround for when user is searching for something
      // before the results are loaded, click on a tags or segments results
      // causing memory leak and dead-results. the proper way is canceling
      // request but we don't support this atm.
      if (this.state.searchText === '') {
        list = []
      }

      this.setState({
        isContactsLoading: false,
        list
      })
    } catch (e) {
      console.log(e)
      this.setState({ isContactsLoading: false })
    }
  }

  // if we had any items in contacts/list/tags we should show dropdown
  isOpen = () => {
    if (this.state.forceCloseSuggestions) {
      return false
    }

    return !!(
      this.state.filteredList.length ||
      this.state.filteredTags.length ||
      this.state.list.length
    )
  }

  renderTagsList = () =>
    this.state.filteredTags.length > 0 && (
      <React.Fragment>
        <Title>Tags</Title>
        {this.state.filteredTags.map((tag, index) => (
          <ListItem
            key={tag.id || index}
            text={tag.text}
            type="tag"
            onClick={() => this.handleSelectNewListItem(tag, 'tag')}
          />
        ))}
        <SectionSeparator />
      </React.Fragment>
    )

  renderSegmentsList = () =>
    this.state.filteredList.length > 0 && (
      <React.Fragment>
        <Title>Lists</Title>
        {this.state.filteredList.map((list, index) => (
          <ListItem
            key={list.id || index}
            text={list.name}
            membersCount={list.member_count}
            type="list"
            onClick={() => this.handleSelectNewListItem(list, 'list')}
          />
        ))}
        <SectionSeparator />
      </React.Fragment>
    )

  renderContactResults = getItemProps => {
    if (this.state.isContactsLoading === false && this.state.list.length == 0) {
      return null
    }

    const hasResults =
      !this.state.isContactsLoading && this.state.list.length > 0

    return (
      <React.Fragment>
        <Title>
          Contacts &nbsp;
          {this.state.isContactsLoading && (
            <i className="fa fa-spin fa-spinner" />
          )}
        </Title>

        {hasResults &&
          this.state.list
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
      </React.Fragment>
    )
  }

  render() {
    return (
      <Downshift
        isOpen={this.isOpen()}
        onOuterClick={() => this.setState({ forceCloseSuggestions: true })}
        render={({ isOpen, getInputProps, getItemProps }) => (
          <div style={{ position: 'relative' }}>
            <SearchInputContainer textLength={this.state.searchText.length}>
              <SearchInput
                {...getInputProps({
                  value: this.state.searchText,
                  onChange: this.handleSearchContact,
                  onBlur: this.handleInputBlur,
                  placeholder: 'Add new recipient',
                  readOnly: this.state.isContactsLoading
                })}
              />

              {this.state.isContactsLoading && (
                <i className="fa fa-spin fa-spinner" />
              )}
            </SearchInputContainer>

            {isOpen && (
              <SearchResults>
                {this.renderTagsList()}

                {this.renderSegmentsList()}

                {this.renderContactResults(getItemProps)}
              </SearchResults>
            )}
          </div>
        )}
      />
    )
  }
}

function mapStateToProps({ contacts }) {
  const tags = selectTags(contacts.tags)
  const isLoadingTags = isFetchingTags(contacts.tags)
  const segmentsList = getSegments(contacts.filterSegments, 'contacts')

  return {
    contacts: contacts.list,
    attributeDefs: contacts.attributeDefs,
    tags,
    isLoadingTags,
    segmentsList,
    isSegmentsList: isListFetched(contacts.filterSegments)
  }
}

export default connect(
  mapStateToProps,
  { getContactsTags, getSavedSegments }
)(AddRecipient)
