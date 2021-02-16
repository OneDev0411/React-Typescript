import React from 'react'
import { Box, Tooltip, Chip, makeStyles, createStyles } from '@material-ui/core'

import { PopoverContactTagSelector } from 'components/TagSelector'
import { noop } from 'utils/helpers'

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'inline-flex',
      cursor: 'pointer',
      flexWrap: 'nowrap'
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
  const tags = contact?.tags || []

  const tagsCount = tags.length
  const showingTags = []
  const currentTags = tags.map(tag => {
    if (showingTags.length < 2) {
      showingTags.push(tag)
    }

    return {
      title: tag,
      value: tag
    }
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
      value={currentTags}
      contact={contact}
      filter={{
        selectedIds: [contact.id]
      }}
      callback={callback}
    />
  )
}

export default TagsString
