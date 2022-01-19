import { memo, useMemo } from 'react'

import { Box, Chip, makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { getContact } from '@app/models/contacts/get-contact'
import { updateContactTags } from '@app/store_actions/contacts/update-contact-tags'
import { PopoverContactTagSelector } from '@app/views/components/TagSelector/components/PopoverContactTagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

import CellContainer from './CellContainer'

const useStyles = makeStyles(
  theme => ({
    container: {
      height: '100%',
      width: '100%'
    },
    noTag: {
      ...theme.typography.body3,
      lineHeight: `${theme.spacing(3)}px`
    },
    tagLabel: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(1),
      ...theme.typography.body3
    }
  }),
  { name: 'TagsCell' }
)

interface Props {
  contact: IContact
  isParkTabActive: boolean
  hasAttributeFilters: boolean
  reloadContacts: () => void
}

function getCurrentTags(tags, showingTags) {
  return tags.map(tag => {
    if (showingTags.length < 2) {
      showingTags.push(tag)
    }

    return {
      title: tag,
      value: tag
    }
  })
}

const TagsCell = ({
  contact,
  hasAttributeFilters,
  isParkTabActive,
  reloadContacts
}: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const showingTags: string[] = []
  const tags = useMemo(() => contact?.tags || [], [contact?.tags])
  const currentTags = getCurrentTags(tags, showingTags)

  const tagsCount = tags.length
  const invisibleTagsCount = tagsCount - showingTags.length

  //----

  const handleChangeTag = async (tags: SelectorOption[] = []) => {
    try {
      if (isParkTabActive || (hasAttributeFilters && tags.length === 0)) {
        return reloadContacts()
      }

      const response = await getContact(contact.id, {
        associations: []
      })
      const newTags = response.data?.tags ?? []

      dispatch(updateContactTags(contact.id, newTags))
    } catch (error) {
      console.error(error)
    }
  }

  //----

  const renderPopOverTagSelector = () => {
    const renderTagsStrip = () => (
      <div className={classes.tagLabel}>
        <span>{showingTags.join(', ')}</span>
        {invisibleTagsCount > 0 && (
          <Chip
            variant="outlined"
            size="small"
            label={`${invisibleTagsCount} more`}
          />
        )}
      </div>
    )

    const renderCellContent = onClick => (
      <Box
        className={classes.container}
        onClick={e => {
          e.stopPropagation()
          onClick(e)
        }}
      >
        {tagsCount === 0 && <div className={classes.noTag}>Add Tags</div>}
        {tagsCount > 0 && renderTagsStrip()}
      </Box>
    )

    return (
      <PopoverContactTagSelector
        showManageTags
        label={`${contact.display_name}'s Tag`}
        anchorRenderer={renderCellContent}
        value={currentTags}
        filter={{
          selectedIds: [contact.id]
        }}
        callback={handleChangeTag}
      />
    )
  }

  //----

  return <CellContainer renderCellContent={renderPopOverTagSelector} />
}

export default memo(TagsCell)
