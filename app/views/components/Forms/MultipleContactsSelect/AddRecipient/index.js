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

import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { SearchInput, SearchInputContainer } from './styled'

import ContactItem from '../../../SelectContactModal/components/ContactItem'
import { ListItem } from './ListItem'
import SearchResults from './SearchResults'
import { onlyItemsWithUUID } from './helpers'

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
    const tagsFuseOptions = {
      keys: ['text'],
      threshold: 0.3
    }

    const segmentsFuseOptions = {
      keys: ['name'],
      threshold: 0.3
    }

    // Tags result
    const filteredTags = new Fuse(
      onlyItemsWithUUID(this.props.tags),
      tagsFuseOptions
    )
      .search(value)
      .slice(0, 5)

    // Segments result
    const filteredList = new Fuse(
      onlyItemsWithUUID(this.props.segmentsList),
      segmentsFuseOptions
    )
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

  createResultSections = ({ getItemProps, highlightedIndex }) => {
    const tagsList = {
      title: 'Tags',
      items: this.state.filteredTags,
      itemRenderer: itemDefaultProps => (
        <ListItem
          {...itemDefaultProps}
          {...getItemProps({
            key: itemDefaultProps.key,
            index: itemDefaultProps.key,
            item: itemDefaultProps.item
          })}
          text={itemDefaultProps.item.text}
          type="tag"
          onClick={() =>
            this.handleSelectNewListItem(itemDefaultProps.item, 'tag')
          }
        />
      )
    }
    const segmentsList = {
      title: 'Lists',
      items: this.state.filteredList,
      itemRenderer: itemDefaultProps => (
        <ListItem
          {...itemDefaultProps}
          {...getItemProps({
            key: itemDefaultProps.key,
            index: itemDefaultProps.key,
            item: itemDefaultProps.item
          })}
          text={itemDefaultProps.item.name}
          membersCount={itemDefaultProps.item.member_count}
          type="list"
          onClick={() =>
            this.handleSelectNewListItem(itemDefaultProps.item, 'list')
          }
        />
      )
    }

    const contactsList = {
      title: 'Contacts',
      isLoading: this.state.isContactsLoading,
      items: this.state.list,
      itemRenderer: itemDefaultProps => (
        <ContactItem
          {...itemDefaultProps}
          summary={itemDefaultProps.item.summary.email || ''}
          onClickHandler={this.handleSelectNewContact}
          isHighlighted={itemDefaultProps.key == highlightedIndex}
          {...getItemProps({
            key: itemDefaultProps.key,
            index: itemDefaultProps.key,
            item: itemDefaultProps.item
          })}
        />
      )
    }

    return [tagsList, segmentsList, contactsList]
  }

  render() {
    return (
      <Downshift
        isOpen={this.isOpen()}
        onOuterClick={() => this.setState({ forceCloseSuggestions: true })}
        render={({
          isOpen,
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex
        }) => (
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

              {this.state.isContactsLoading && <IconCircleSpinner />}
            </SearchInputContainer>
            {isOpen && (
              <SearchResults
                data={this.createResultSections({
                  getItemProps,
                  highlightedIndex
                })}
                containerProps={{
                  getMenuProps
                }}
              />
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
