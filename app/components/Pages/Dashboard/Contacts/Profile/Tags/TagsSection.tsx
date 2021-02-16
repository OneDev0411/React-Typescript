import React, { useMemo } from 'react'
import { Box, Chip } from '@material-ui/core'

import { PopoverContactTagSelector } from 'components/TagSelector'

import { Section } from '../components/Section'

import { Tag } from './Tag'

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
    <Section
      title="Tags"
      setting={{
        tooltip: 'Manage Tags',
        href: '/dashboard/account/manage-tags'
      }}
    >
      <Box px={3} display="flex" flexWrap="wrap">
        {hasTags && tags.map(tag => <Tag key={tag} text={tag} />)}
        <PopoverContactTagSelector
          anchorRenderer={onClick => (
            <Chip
              label={hasTags ? 'Edit' : 'Add Tag'}
              variant="outlined"
              color="secondary"
              onClick={onClick}
            />
          )}
          value={currentTags}
          filter={{
            selectedIds: [contact.id]
          }}
          callback={() => onChange()}
        />
      </Box>
    </Section>
  )
}

export default Tags
