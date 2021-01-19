import React from 'react'
import _ from 'underscore'
import { Box, Tooltip, Chip, makeStyles, createStyles } from '@material-ui/core'

import { PopoverContactTagSelector } from 'components/TagSelector'
import { noop } from 'utils/helpers'

import { getContactTags } from '../../../../../../../models/contacts/helpers'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'inline-block',
      cursor: 'pointer'
    },
    noTag: {
      fontSize: theme.typography.caption.fontSize
    },
    tagLabel: {
      fontSize: theme.typography.caption.fontSize,
      marginRight: theme.spacing(0.5)
    },
    chip: {
      marginRight: theme.spacing(0.25)
    }
  })
)

const TagsString = ({ contact, callback = noop }) => {
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
    <PopoverContactTagSelector
      anchorRenderer={onClick => (
        <Tooltip title="Click to edit">
          <Box
            className={classes.container}
            onClick={event => {
              event.stopPropagation()
              onClick(event)
            }}
          >
            {tagsCount === 0 ? (
              <span className={classes.noTag}>Add Tags</span>
            ) : (
              <Box>
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
              </Box>
            )}
            {invisibleTagsCount > 0 && (
              <Chip
                variant="outlined"
                size="small"
                label={`+ ${invisibleTagsCount}`}
              />
            )}
          </Box>
        </Tooltip>
      )}
      contact={contact}
      filter={{
        selectedIds: [contact.id]
      }}
      callback={callback}
    />
  )
}

export default TagsString
