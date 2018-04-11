import React from 'react'

const TagsString = ({ tags }) => {
  if (Object.keys(tags).length === 0) {
    return <p style={{ color: '#8da2b5', marginBottom: 0 }}>No Tags</p>
  }

  let tagString = ''
  // We can't break forEach.
  let stopForeach = false

  Object.keys(tags).forEach((key, index) => {
    if (!stopForeach) {
      let tag = tags[key].tag

      // max kength 28 came from design
      if (tagString.length + tag.length <= 28) {
        tagString +=
          tag +
          // Add ', ' if it is not the last item in  the object
          (index !== Object.keys(tags).length - 1 ? ', ' : '')
      } else {
        stopForeach = true
        // remove the last ', '
        tagString = tagString.slice(0, -2)
        tagString += ` and ${Object.keys(tags).length - index} more`
      }
    }
  })

  return <div>{tagString}</div>
}

export default TagsString
