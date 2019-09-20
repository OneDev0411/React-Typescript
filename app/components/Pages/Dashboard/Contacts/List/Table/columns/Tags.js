import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import styled from 'styled-components'

import { getContactTags } from '../../../../../../../models/contacts/helpers'
import ALink from '../../../../../../../views/components/ALink'
import { grey } from '../../../../../../../views/utils/colors'

const AddTags = styled.span`
  color: ${grey.A550};
`
const TagsString = ({ contact, onSelectTagContact }) => {
  const tags = getContactTags(contact)

  const tagsCount = _.size(tags)
  const showingTags = []
  const getShowingTags = () => showingTags.join(', ')

  _.every(tags, item => {
    if (getShowingTags().length + item.text.length <= 66) {
      showingTags.push(item.text)

      return true
    }

    return false
  })

  const invisibleTagsCount = tagsCount - showingTags.length

  return (
    <ALink
      data-test="add-tag"
      style={{ cursor: 'pointer' }}
      onClick={event => {
        event.stopPropagation()
        onSelectTagContact(contact.id)
      }}
    >
      {tagsCount === 0 ? (
        <AddTags className="primaryHover">Add Tags</AddTags>
      ) : (
        getShowingTags()
      )}
      {invisibleTagsCount > 0 && <span> and {invisibleTagsCount} more</span>}
    </ALink>
  )
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs }
  } = state

  return { attributeDefs }
}

export default connect(mapStateToProps)(TagsString)
