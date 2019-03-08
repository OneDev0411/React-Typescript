import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'underscore'
import unionBy from 'lodash/unionBy'
import intersectionBy from 'lodash/intersectionBy'

import { defaultTags } from 'utils/default-tags'

import OverlayDrawer from '../../../../../../views/components/OverlayDrawer'
import Info from './Info'
import CustomTag from './CustomTag'
import DrawerFooter from './DrawerFooter'
import { SubHeaderContainer } from './styled'
import Tags from './Tags'
import {
  addAttributes,
  deleteAttributes,
  deleteAttributesFromContacts,
  getContactsTags,
  upsertAttributesToContacts
} from '../../../../../../store_actions/contacts'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import {
  getAttributeFromSummary,
  getContactAttribute
} from '../../../../../../models/contacts/helpers'
import {
  selectContact,
  selectContactsInfo
} from '../../../../../../reducers/contacts/list'
import { selectTags } from '../../../../../../reducers/contacts/tags'
import { confirmation } from '../../../../../../store_actions/confirmation'

class TagsOverlay extends React.Component {
  constructor(props) {
    super(props)

    const { selectedContactsIds, ContactListStore, existingTags } = this.props

    this.state = {
      tags: this.getCommonTags(
        selectedContactsIds,
        ContactListStore,
        existingTags
      ),
      isSubmitting: false,
      newTagValue: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    const newTags = this.getCommonTags(
      nextProps.selectedContactsIds,
      nextProps.ContactListStore,
      nextProps.existingTags
    )
    const oldTags = this.getCommonTags(
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
          'We noticed you have un-added tag. Please select the \'Add\' link before saving',
        hideCancelButton: true,
        confirmLabel: 'Ok'
      })
    }

    const { closeOverlay } = this.props
    const { tags } = this.state
    const newTags = tags.filter(tag => tag.isSelected && !tag.id)
    const removedTags = tags.filter(tag => !tag.isSelected && tag.id)

    const {
      upsertAttributesToContacts,
      deleteAttributesFromContacts,
      addAttributes,
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
        await addAttributes(selectedContactsIds[0], attributes)
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
      const contactsTags = selectedContactsIds.map(contactId =>
        getContactAttribute(
          selectContact(ContactListStore, contactId),
          attribute_def
        )
      )
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

  // get common tags between selected contacts & default tags
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
    const defaultsWithExisting = defaultTags
      .concat(existingTags.map(tag => tag[attribute_def.data_type]))
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

  render() {
    const {
      closeOverlay,
      selectedContactsIds,
      ContactListStore,
      isOpen
    } = this.props
    const { tags, isSubmitting, newTagValue } = this.state
    const { attributeDefs } = this.props
    const { data_type: tagDataType } =
      selectDefinitionByName(attributeDefs, 'tag') || {}
    const { count: contactsCount } = selectContactsInfo(ContactListStore)
    let DrawerHeaderText = ''

    if (selectedContactsIds.length > 1) {
      DrawerHeaderText = `${selectedContactsIds.length} contacts`
    } else if (selectedContactsIds.length === 1 && contactsCount) {
      const contact = selectContact(ContactListStore, selectedContactsIds[0])

      if (contact) {
        DrawerHeaderText = getAttributeFromSummary(contact, 'display_name')
      }
    }

    return (
      <OverlayDrawer isOpen={isOpen} width={50} onClose={closeOverlay}>
        <OverlayDrawer.Header title={`Tags for ${DrawerHeaderText}`} />

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
  const searchText = selectContactsInfo(ContactListStore).searchText || ''

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
    addAttributes,
    deleteAttributes,
    getContactsTags,
    confirmation
  }
)(TagsOverlay)
