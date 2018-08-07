import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import unionBy from 'lodash/unionBy'
import OverlayDrawer from '../../../../../../views/components/OverlayDrawer'
import DrawerHeader from './DrawerHeader'
import Info from './Info'
import CustomTag from './CustomTag'
import DrawerFooter from './DrawerFooter'
import { SubHeaderContainer } from './styled'
import Tags from './Tags'
import {
  upsertAttributesToContacts,
  deleteAttributesFromContacts,
  addAttributes,
  deleteAttributes,
  getContacts,
  getContactsTags
} from '../../../../../../store_actions/contacts'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import {
  getContactAttribute,
  getAttributeFromSummary
} from '../../../../../../models/contacts/helpers'
import {
  selectContact,
  // selectCurrentPage,
  selectContactsInfo
} from '../../../../../../reducers/contacts/list'
import intersectionBy from 'lodash/intersectionBy'
import { selectTags } from '../../../../../../reducers/contacts/tags'
import { confirmation } from '../../../../../../store_actions/confirmation'

const defaultTags = [
  'Seller',
  'Agent',
  'First Home',
  'Lawyer',
  'Contractor',
  'Painter',
  'Closing Officer',
  'Buyer'
]

class TagsOverlay extends React.Component {
  constructor(props) {
    super(props)

    const { selectedContactsIds, list, existingTags } = this.props

    this.state = {
      tags: this.getCommonTags(selectedContactsIds, list, existingTags),
      isSubmitting: false,
      newTagValue: ''
    }
  }

  componentDidMount() {
    if (this.props.existingTags.length === 0) {
      this.props.getContactsTags()
    }
  }

  componentWillReceiveProps(nextProps) {
    const newTags = this.getCommonTags(
      nextProps.selectedContactsIds,
      nextProps.list,
      nextProps.existingTags
    )
    const oldTags = this.getCommonTags(
      this.props.selectedContactsIds,
      this.props.list,
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

  onTagSelectionChange = (tagIndex, isSelected) => {
    let tags = [...this.state.tags]
    const newTag = {
      ...tags[tagIndex],
      isSelected
    }

    tags[tagIndex] = newTag
    this.setState({ tags })
  }
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

      this.setState({
        tags: tags.concat({
          [attribute_def.data_type]: newTagValue,
          attribute_def: attribute_def.id,
          isSelected: true
        }),
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
          "We noticed you have un-added tag. Please select the 'Add' link before saving",
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
      getContacts,
      getContactsTags,
      selectedContactsIds,
      attributeDefs,
      list
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
        await upsertAttributesToContacts(selectedContactsIds, attributes)
      }
    }

    if (removedTags.length > 0) {
      const contactsTags = selectedContactsIds.map(contactId =>
        getContactAttribute(selectContact(list, contactId), attribute_def)
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
        await deleteAttributesFromContacts(removedTagsIds)
      }
    }

    if (selectedContactsIds.length > 1) {
      // const currentPage = selectCurrentPage(list)

      await getContacts()
    }

    await getContactsTags()
    this.setState({ isSubmitting: false })

    closeOverlay()
  }

  // get common tags between selected contacts & default tags
  getCommonTags = (selectedContactsIds, list, existingTags) => {
    if (
      selectedContactsIds.length === 0 ||
      selectContactsInfo(list).count === 0
    ) {
      return []
    }

    const { attributeDefs } = this.props
    const attribute_def = selectDefinitionByName(attributeDefs, 'tag')
    const contactsTags = selectedContactsIds.map(contactId =>
      getContactAttribute(selectContact(list, contactId), attribute_def)
    )
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

    return unionBy(filteredTags, defaultsWithExisting, attribute_def.data_type)
  }

  render() {
    const { closeOverlay, selectedContactsIds, list, isOpen } = this.props
    const { tags, isSubmitting, newTagValue } = this.state
    const { attributeDefs } = this.props
    const { data_type: tagDataType } =
      selectDefinitionByName(attributeDefs, 'tag') || {}
    const { count: contactsCount } = selectContactsInfo(list)
    let DrawerHeaderText = ''

    if (selectedContactsIds.length > 1) {
      DrawerHeaderText = `${selectedContactsIds.length} contacts`
    } else if (selectedContactsIds.length === 1 && contactsCount) {
      DrawerHeaderText = getAttributeFromSummary(
        selectContact(list, selectedContactsIds[0]),
        'display_name'
      )
    }

    return (
      <OverlayDrawer isOpen={isOpen} width={50} onClose={closeOverlay}>
        <OverlayDrawer.Header>
          <DrawerHeader text={DrawerHeaderText} />
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
    contacts: { attributeDefs, list, tags }
  } = state
  const existingTags = selectTags(tags)

  return { attributeDefs, list, existingTags }
}

export default connect(
  mapStateToProps,
  {
    upsertAttributesToContacts,
    deleteAttributesFromContacts,
    addAttributes,
    deleteAttributes,
    getContacts,
    getContactsTags,
    confirmation
  }
)(TagsOverlay)
