import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
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
  getContacts
} from '../../../../../../store_actions/contacts'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import {
  getContactAttribute,
  getAttributeFromSummary
} from '../../../../../../models/contacts/helpers'
import {
  selectContact,
  selectCurrentPage
} from '../../../../../../reducers/contacts/list'
import intersectionBy from 'lodash/intersectionBy'

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

    const { selectedContactsIds, list } = this.props

    this.state = {
      tags: this.getCommonTags(selectedContactsIds, list),
      isSubmitting: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const newTags = this.getCommonTags(
      nextProps.selectedContactsIds,
      nextProps.list
    )
    const oldTags = this.getCommonTags(
      this.props.selectedContactsIds,
      this.props.list
    )

    if (!_.isEqual(newTags, oldTags)) {
      this.setState({ tags: newTags })
    }
  }

  shouldComponentUpdate(nextProps, nextSate) {
    // Prevent rendering when there is a ongoing fetch.
    return !nextSate.isSubmitting || !this.state.isSubmitting
  }

  onTagSelectionChange = (tagIndex, isSelected) => {
    const { attributeDefs } = this.props
    const attribute_def = selectDefinitionByName(attributeDefs, 'tag')
    let tags = [...this.state.tags]
    const newTag = {
      ...tags[tagIndex],
      isSelected,
      attribute_def: attribute_def.id
    }

    tags[tagIndex] = newTag
    this.setState({ tags })
  }

  onUpsert = newTag => {
    const { tags } = this.state
    const tagIndex = tags.findIndex(tag => tag.text === newTag)

    if (tagIndex > -1) {
      this.onTagSelectionChange(tagIndex, true)
    } else {
      this.setState({ tags: tags.concat({ text: newTag, isSelected: true }) })
    }
  }

  onSubmit = async () => {
    const { isSubmitting } = this.state

    if (isSubmitting) {
      return
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
      const currentPage = selectCurrentPage(list)

      await getContacts(currentPage)
    }

    this.setState({ isSubmitting: false })

    closeOverlay()
  }

  // get common tags between selected contacts & default tags
  getCommonTags = (selectedContactsIds, list) => {
    if (selectedContactsIds.length === 0) {
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

    return _.uniq(
      filteredTags.concat(
        defaultTags.map(tagText => ({
          [attribute_def.data_type]: tagText,
          isSelected: false
        }))
      ),
      attribute_def.data_type
    )
  }

  render() {
    const { closeOverlay, selectedContactsIds, list, isOpen } = this.props
    const { tags, isSubmitting } = this.state
    const { attributeDefs } = this.props
    const { data_type: tagDataType } =
      selectDefinitionByName(attributeDefs, 'tag') || {}
    let DrawerHeaderText = ''

    if (selectedContactsIds.length > 1) {
      DrawerHeaderText = `${selectedContactsIds.length} contacts`
    } else if (selectedContactsIds.length === 1) {
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
            <CustomTag onUpsert={this.onUpsert} />
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
    contacts: { attributeDefs, list }
  } = state

  return { attributeDefs, list }
}

export default connect(
  mapStateToProps,
  {
    upsertAttributesToContacts,
    deleteAttributesFromContacts,
    addAttributes,
    deleteAttributes,
    getContacts
  }
)(TagsOverlay)
