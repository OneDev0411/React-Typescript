import React, { useMemo } from 'react'
import { Box, Chip } from '@material-ui/core'

import { mdiTagOutline } from '@mdi/js'

import { PopoverContactTagSelector } from 'components/TagSelector'

import { Tag } from './Tag'
import { SectionButton } from '../components/Section/Button'

interface Props {
  contact: INormalizedContact
  onChange: () => void
}

function Tags({ contact, onChange }: Props) {
  const tags = contact.tags || []
  const hasTags = tags.length > 0
  const currentTags = useMemo(
    () =>
      tags.map(tag => {
        return {
          title: tag,
          value: tag
        }
      }),
    [tags]
  )

  return (
    <Box px={3} display="flex" flexWrap="wrap">
      {hasTags && tags.map(tag => <Tag key={tag} text={tag} />)}
      <PopoverContactTagSelector
        showManageTags
        label={`${contact.display_name}'s Tags`}
        anchorRenderer={onClick =>
          hasTags ? (
            <Chip
              label="Edit"
              variant="outlined"
              color="secondary"
              size="small"
              onClick={onClick}
            />
          ) : (
            <SectionButton
              label="Add some tags"
              icon={mdiTagOutline}
              onClick={onClick}
            />
          )
        }
        value={currentTags}
        filter={{
          selectedIds: [contact.id]
        }}
        callback={() => onChange()}
      />
    </Box>
  )
}

export default Tags
