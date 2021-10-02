import { useState, useMemo, memo } from 'react'

import { Box, Tooltip, Chip, makeStyles } from '@material-ui/core'

import { PopoverContactTagSelector } from 'components/TagSelector'
import { SelectorOption } from 'components/TagSelector/type'
import { getContact } from 'models/contacts/get-contact'

const useStyles = makeStyles(
  theme => ({
    container: {
      maxWidth: '100%',
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
      maxWidth: '100%',
      marginRight: theme.spacing(0.25)
    }
  }),
  { name: 'ContactListTagsString' }
)

interface Props {
  contact: IContact
  isParkTabActive: boolean
  hasAttributeFilters: boolean
  reloadContacts: () => void
}

const TagsString = ({
  contact: contactProp,
  hasAttributeFilters,
  isParkTabActive,
  reloadContacts
}: Props) => {
  const classes = useStyles()
  const [contact, setContact] = useState<IContact>(contactProp)

  const memoizedContact = useMemo(() => contact || [], [contact])
  const tags = useMemo(
    () => memoizedContact?.tags || [],
    [memoizedContact?.tags]
  )

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

  const handleChangeTag = async (tags: SelectorOption[] = []) => {
    try {
      if (isParkTabActive || (hasAttributeFilters && tags.length === 0)) {
        return reloadContacts()
      }

      const response = await getContact(memoizedContact.id, {
        associations: []
      })

      setContact(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <PopoverContactTagSelector
      showManageTags
      label={`${memoizedContact.display_name}'s Tag`}
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
              <Box maxWidth="100%">
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
                {invisibleTagsCount > 0 && (
                  <Chip
                    variant="outlined"
                    size="small"
                    label={`+ ${invisibleTagsCount}`}
                  />
                )}
              </Box>
            )}
          </Box>
        </Tooltip>
      )}
      value={currentTags}
      filter={{
        selectedIds: [memoizedContact.id]
      }}
      callback={handleChangeTag}
    />
  )
}

export default memo(TagsString)
