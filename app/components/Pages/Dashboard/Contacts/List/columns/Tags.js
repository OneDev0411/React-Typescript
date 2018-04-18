import React from 'react'
import _ from 'underscore'

const TagsString = ({ tags }) => {
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

export default TagsString
