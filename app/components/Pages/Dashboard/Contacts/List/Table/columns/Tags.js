import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import styled from 'styled-components'
import { Chip, makeStyles } from '@material-ui/core'

import { getContactTags } from '../../../../../../../models/contacts/helpers'
import ALink from '../../../../../../../views/components/ALink'
import { grey } from '../../../../../../../views/utils/colors'

const AddTags = styled.span`
  color: ${grey.A550};
`
const useStyles = makeStyles(theme => ({
  tagLabel: {
    fontSize: 11,
    marginRight: theme.spacing(0.5)
  },
  chip: {
    cursor: 'pointer',
    marginRight: theme.spacing(0.25)
  }
}))

const TagsString = ({ contact, onSelectTagContact }) => {
  const classes = useStyles()
  const tags = getContactTags(contact)

  const tagsCount = _.size(tags)
  const showingTags = []

  _.every(tags, item => {
    if (showingTags.length < 2) {
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
      noStyle
      onClick={event => {
        event.stopPropagation()
        onSelectTagContact(contact.id)
      }}
    >
      {tagsCount === 0 ? (
        <AddTags className="primaryHover">Add Tags</AddTags>
      ) : (
        <>
          <span className={classes.tagLabel}>TAGS:</span>
          {showingTags.map(tag => (
            <Chip
              key={tag}
              variant="outlined"
              size="small"
              className={classes.chip}
              label={tag}
            />
          ))}
        </>
      )}
      {invisibleTagsCount > 0 && (
        <Chip
          variant="outlined"
          size="small"
          label={`+ ${invisibleTagsCount}`}
        />
      )}
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
