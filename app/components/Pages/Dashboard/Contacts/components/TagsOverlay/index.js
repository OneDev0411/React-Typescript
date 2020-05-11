import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'underscore'
import unionBy from 'lodash/unionBy'
import intersectionBy from 'lodash/intersectionBy'

import OverlayDrawer from 'components/OverlayDrawer'

import {
  getAttributeFromSummary,
  getContactAttribute // eslint-disable-line
} from 'models/contacts/helpers'

import {
  updateContact,
  deleteAttributes,
  deleteAttributesFromContacts,
  getContactsTags,
  upsertAttributesToContacts
} from 'actions/contacts'
import { confirmation } from 'actions/confirmation'

import { addAttributesBulk } from 'models/contacts/add-attributes-bulk'

import { selectTags } from 'reducers/contacts/tags'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { selectContact, selectContactsInfo } from 'reducers/contacts/list'

import Tags from './Tags'
import Info from './Info'
import CustomTag from './CustomTag'
import Header from './Header'
import DrawerFooter from './DrawerFooter'
import { SubHeaderContainer } from './styled'

class TagsOverlay extends React.Component {
  constructor(props) {
    super(props)

    const {
      entireMode,
      selectedContactsIds,
      ContactListStore,
      existingTags
    } = this.props

    const tags = entireMode
      ? this.getAllTags()
      : this.getCommonTags(selectedContactsIds, ContactListStore, existingTags)

    this.state = {
      tags,
      isSubmitting: false,
      newTagValue: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const newTags = this.props.entireMode
      ? this.getAllTags()
      : this.getCommonTags(
          nextProps.selectedContactsIds,
          nextProps.ContactListStore,
          nextProps.existingTags
        )

    const oldTags = this.props.entireMode
      ? this.state.tags
      : this.getCommonTags(
          this.props.selectedContactsIds,
          this.props.ContactListStore,
          this.props.existingTags
        )

    if (!_.isEqual(newTags, oldTags) || !nextProps.isOpen) {
      this.setState({ tags: newTags })
    }

    if (!nextProps.isOpen) {
      this.setState({ newTagValue: '' })
    }
  }

  shouldComponentUpdate(nextProps, nextSate) {
    // Prevent rendering when there is a ongoing fetch.
    return !nextSate.isSubmitting || !this.state.isSubmitting
  }

  onTagSelectionChange = (tagIndex, isSelected) =>
    this.setState(({ tags: prevTags }) => ({
      tags: prevTags.map((tag, index) =>
        index === tagIndex
          ? {
              ...prevTags[tagIndex],
              isSelected
            }
          : prevTags[index]
      )
    }))

  newTagChange = newTagValue => this.setState({ newTagValue })

  onUpsert = event => {
    event.preventDefault()

    const { tags, newTagValue } = this.state
    const tagIndex = tags.findIndex(tag => tag.text === newTagValue)

    if (tagIndex > -1) {
      this.onTagSelectionChange(tagIndex, true)
      this.setState({
        newTagValue: ''
      })
    } else {
      const { attributeDefs } = this.props
      const attribute_def = selectDefinitionByName(attributeDefs, 'tag')

      const sortedTags = this.sortTags(
        tags.concat({
          [attribute_def.data_type]: newTagValue,
          attribute_def: attribute_def.id,
          isSelected: true
        })
      )

      this.setState({
        tags: sortedTags,
        newTagValue: ''
      })
    }
  }

  onSubmit = async () => {
    const { isSubmitting, newTagValue } = this.state

    if (isSubmitting) {
      return
    }

    if (/\S/.test(newTagValue)) {
      return this.props.confirmation({
        description:
          "We noticed you have un-added tag. Please select the 'Add' button before saving",
        hideCancelButton: true,
        confirmLabel: 'OK'
      })
    }

    const { entireMode, closeOverlay } = this.props
    const { tags } = this.state
    const newTags = tags.filter(tag => tag.isSelected && !tag.id)

    // We only support add tags for entire mode
    // Se having new tags is enough for us
    if (entireMode) {
      const {
        users,
        searchText,
        conditionOperator,
        filters,
        excludedContactsIds: excludes,
        getContactsTags,
        resetSelectedRows,
        handleChangeContactsAttributes
      } = this.props

      this.setState({ isSubmitting: true })

      await addAttributesBulk({
        attributes: newTags,
        users,
        searchText,
        conditionOperator,
        filters,
        excludes
      })
      handleChangeContactsAttributes && (await handleChangeContactsAttributes())
      resetSelectedRows && resetSelectedRows()

      await getContactsTags()
      this.setState({ isSubmitting: false })

      closeOverlay()
    }

    const removedTags = tags.filter(tag => !tag.isSelected && tag.id)

    const {
      contact,
      upsertAttributesToContacts,
      deleteAttributesFromContacts,
      deleteAttributes,
      getContactsTags,
      selectedContactsIds,
      attributeDefs,
      ContactListStore
    } = this.props
    const attribute_def = selectDefinitionByName(attributeDefs, 'tag')

    this.setState({ isSubmitting: true })

    if (newTags.length > 0) {
      const attributes = newTags.map(tag => ({
        [attribute_def.data_type]: tag.text,
        attribute_def: tag.attribute_def
      }))

      if (selectedContactsIds.length === 1) {
        await this.props.updateContact(selectedContactsIds[0], attributes)
      } else {
        const updatedContacts = []

        selectedContactsIds.forEach(contactId => {
          const contact = selectContact(ContactListStore, contactId)

          const contactTags = getContactAttribute(contact, attribute_def)

          const contactNewTags = attributes.filter(
            tag =>
              !contactTags.some(
                contactTag =>
                  tag[attribute_def.data_type] ===
                  contactTag[attribute_def.data_type]
              )
          )

          if (contactNewTags.length !== 0) {
            updatedContacts.push({
              id: contactId,
              attributes: contactNewTags
            })
          }
        })

        await upsertAttributesToContacts(updatedContacts)
      }
    }

    if (removedTags.length > 0) {
      const contactsTags = selectedContactsIds.map(contactId => {
        const selectedContact =
          contact && contact.id === contactId
            ? contact
            : selectContact(ContactListStore, contactId)

        return getContactAttribute(selectedContact, attribute_def)
      })
      const flattedContactsTags = [].concat(...contactsTags)
      const removedContactsTags = []

      removedTags.forEach(removedTag =>
        removedContactsTags.push(
          flattedContactsTags.filter(tag => tag.text === removedTag.text)
        )
      )

      const removedTagsIds = []
        .concat(...removedContactsTags)
        .map(tag => tag.id)

      if (selectedContactsIds.length === 1) {
        await deleteAttributes(selectedContactsIds[0], removedTagsIds)
      } else {
        await deleteAttributesFromContacts(
          selectedContactsIds,
          removedTagsIds,
          attribute_def
        )
      }
    }

    this.props.handleChangeContactsAttributes &&
      (await this.props.handleChangeContactsAttributes())
    this.props.resetSelectedRows && this.props.resetSelectedRows()

    await getContactsTags()
    this.setState({ isSubmitting: false })

    closeOverlay()
  }

  getAllTags = () => {
    const attributeDef = selectDefinitionByName(this.props.attributeDefs, 'tag')
    const existingTags = this.props.existingTags
    const allTags = existingTags
      .map(tag => tag[attributeDef.data_type])
      .map(
        tagText => ({
          [attributeDef.data_type]: tagText,
          attribute_def: attributeDef.id,
          isSelected: false
        }),
        existingTags
      )
    const uniqTags = _.uniq(allTags, attributeDef.data_type)

    return this.sortTags(uniqTags)
  }

  // get common tags between selected contacts & default tags
  // TODO: remove this function or simplify this as we don't have default tags
  getCommonTags = (selectedContactsIds, ContactListStore, existingTags) => {
    if (selectedContactsIds.length === 0) {
      return []
    }

    const { attributeDefs } = this.props
    const attribute_def = selectDefinitionByName(attributeDefs, 'tag')
    const contactsTags = selectedContactsIds.map(contactId => {
      const contact =
        this.props.contact && this.props.contact.id === contactId
          ? this.props.contact
          : selectContact(ContactListStore, contactId)

      if (contact) {
        return getContactAttribute(contact, attribute_def)
      }

      return []
    })
    const filteredTags = intersectionBy(
      ...contactsTags,
      attribute_def.data_type
    ).map(tag => ({
      ...tag,
      isSelected: true
    }))
    const defaultsWithExisting = existingTags
      .map(tag => tag[attribute_def.data_type])
      .map(
        tagText => ({
          [attribute_def.data_type]: tagText,
          attribute_def: attribute_def.id,
          isSelected: false
        }),
        existingTags
      )

    return this.sortTags(
      unionBy(filteredTags, defaultsWithExisting, attribute_def.data_type)
    )
  }

  sortTags(tags) {
    const { attributeDefs } = this.props
    const attribute_def = selectDefinitionByName(attributeDefs, 'tag')

    return tags.sort((tag1, tag2) => {
      const tag1Text = tag1[attribute_def.data_type].trim().toLowerCase()
      const tag2Text = tag2[attribute_def.data_type].trim().toLowerCase()

      if (tag1Text < tag2Text) {
        return -1
      }

      if (tag1Text > tag2Text) {
        return 1
      }

      return 0
    })
  }

  getDrawerHeader() {
    let contactsHeader = ''
    const {
      entireMode,
      totalContactsCount,
      excludedContactsIds,
      selectedContactsIds,
      ContactListStore
    } = this.props
    const contactsCount = entireMode
      ? totalContactsCount - excludedContactsIds.length
      : selectedContactsIds.length

    if (contactsCount > 1) {
      contactsHeader = `${contactsCount} contacts`
    } else if (contactsCount === 1) {
      const contact = selectContact(ContactListStore, selectedContactsIds[0])

      if (contact) {
        contactsHeader = getAttributeFromSummary(contact, 'display_name')
      } else {
        contactsHeader = 'contact'
      }
    }

    return `Tags for ${contactsHeader}`
  }

  render() {
    const { closeOverlay, isOpen } = this.props
    const { tags, isSubmitting, newTagValue } = this.state
    const { attributeDefs } = this.props
    const { data_type: tagDataType } =
      selectDefinitionByName(attributeDefs, 'tag') || {}
    const drawerHeader = this.getDrawerHeader()

    return (
      <OverlayDrawer open={isOpen}>
        <OverlayDrawer.Header>
          <Header title={drawerHeader} onClose={closeOverlay} />
        </OverlayDrawer.Header>

        <OverlayDrawer.Body>
          <SubHeaderContainer>
            <Info />
            <CustomTag
              onUpsert={this.onUpsert}
              newTagChange={this.newTagChange}
              inputValue={newTagValue}
            />
          </SubHeaderContainer>
          <Tags
            tags={tags}
            tagDataType={tagDataType}
            onSelectionChange={this.onTagSelectionChange}
          />
        </OverlayDrawer.Body>
        <OverlayDrawer.Footer>
          <DrawerFooter
            tagsLength={tags.filter(tag => tag.isSelected).length}
            onSubmit={this.onSubmit}
            isSubmitting={isSubmitting}
            closeOverlay={closeOverlay}
          />
        </OverlayDrawer.Footer>
      </OverlayDrawer>
    )
  }
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs, list: ContactListStore, tags }
  } = state
  const existingTags = selectTags(tags)
  const filter = selectContactsInfo(ContactListStore).filter || []
  const searchText = selectContactsInfo(ContactListStore).searchInputValue || ''

  return {
    attributeDefs,
    ContactListStore,
    existingTags,
    filter,
    searchText
  }
}

TagsOverlay.propTypes = {
  selectedContactsIds: PropTypes.array
}

export default connect(
  mapStateToProps,
  {
    upsertAttributesToContacts,
    deleteAttributesFromContacts,
    deleteAttributes,
    getContactsTags,
    confirmation,
    updateContact
  }
)(TagsOverlay)
