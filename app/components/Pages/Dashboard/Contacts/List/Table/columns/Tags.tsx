import React, { useState, memo } from 'react'
import { Box, Tooltip, Chip, makeStyles, createStyles } from '@material-ui/core'

import { getContact } from 'models/contacts/get-contact'

import { PopoverContactTagSelector } from 'components/TagSelector'

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

interface Props {
  contact: IContact
  isParkTabActive: boolean
  reloadContacts: () => void
}

const TagsString = ({
  contact: contactProp,
  isParkTabActive,
  reloadContacts
}: Props) => {
  const classes = useStyles()
  const [contact, setContact] = useState<IContact>(contactProp)
  const tags = contact?.tags || []

  const tagsCount = tags.length
  const showingTags: string[] = []
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

  const handleChangeTag = async () => {
    try {
      if (isParkTabActive) {
        reloadContacts()
      } else {
        const response = await getContact(contact.id, {
          associations: []
        })

        setContact(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <PopoverContactTagSelector
      label={`${contact.display_name}'s Tag`}
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
      filter={{
        selectedIds: [contact.id]
      }}
      callback={handleChangeTag}
    />
  )
}

export default memo(TagsString)
