import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { getContactTags } from '../../../../../../../models/contacts/helpers'
import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'
import ShadowButton from '../../../../../../../views/components/Button/ShadowButton'

const TagsTextContainer = ShadowButton.extend`
  font-weight: normal;
  :hover {
    text-decoration: underline;
  }
`

const TagsString = ({ contact, attributeDefs, onSelectTagContact }) => {
  const attribute_def = selectDefinitionByName(attributeDefs, 'tag')
  const tags = getContactTags(contact, attribute_def)

  const tagsCount = _.size(tags)
  const showingTags = []
  const getShowingTags = () => showingTags.join(', ')

  if (tagsCount === 0) {
    return <div style={{ color: '#c5c5c5' }}>No Tags</div>
  }

  _.every(tags, item => {
    if (getShowingTags().length + item.text.length <= 28) {
      showingTags.push(item.text)

      return true
    }

    return false
  })

  const invisibleTagsCount = tagsCount - showingTags.length

  return (
    <TagsTextContainer
      onClick={event => {
        event.stopPropagation()
        onSelectTagContact(contact.id)
      }}
    >
      {getShowingTags()}
      {invisibleTagsCount > 0 && <span> and {invisibleTagsCount} more</span>}
    </TagsTextContainer>
  )
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs }
  } = state

  return { attributeDefs }
}

export default connect(mapStateToProps)(TagsString)
