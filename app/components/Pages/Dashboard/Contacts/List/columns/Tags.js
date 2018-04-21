import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { getContactTags } from '../../../../../../models/contacts/helpers'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

const TagsString = ({ contact, attributeDefs }) => {
  const attribute_def = selectDefinitionByName(attributeDefs, 'tag')
  const tags = getContactTags(contact, attribute_def)

  const tagsCount = _.size(tags)
  const showingTags = []
  const getShowingTags = () => showingTags.join(', ')

  if (tagsCount === 0) {
    return <p style={{ color: '#8da2b5', marginBottom: 0 }}>No Tags</p>
  }

  _.every(tags, item => {
    if (getShowingTags().length + item.tag.length <= 28) {
      showingTags.push(item.tag)

      return true
    }

    return false
  })

  const invisibleTagsCount = tagsCount - showingTags.length

  return (
    <div>
      {getShowingTags()}
      {invisibleTagsCount > 0 && <span> and {invisibleTagsCount} more</span>}
    </div>
  )
}

function mapStateToProps(state) {
  const { contacts: { attributeDefs } } = state

  return { attributeDefs }
}

export default connect(mapStateToProps)(TagsString)
