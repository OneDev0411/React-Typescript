import React, { useMemo } from 'react'
import { Box, Chip, Typography, makeStyles, Theme } from '@material-ui/core'

import { mdiTagOutline } from '@mdi/js'

import { PopoverContactTagSelector } from 'components/TagSelector'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { Tag } from './Tag'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      '&:hover $editTag': {
        visibility: 'visible'
      }
    },
    addTag: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[700],
      cursor: 'pointer',
      '&:hover': {
        color: theme.palette.secondary.main
      }
    },
    editTag: {
      visibility: 'hidden'
    },
    label: {
      marginLeft: theme.spacing(0.5)
    }
  }),
  { name: 'ContactProfileTags' }
)

interface Props {
  contact: INormalizedContact
  onChange: () => void
}

function Tags({ contact, onChange }: Props) {
  const classes = useStyles()
  const tags = useMemo(() => contact.tags || [], [contact.tags])
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
    <Box className={classes.container}>
      {hasTags && tags.map(tag => <Tag key={tag} text={tag} />)}
      <PopoverContactTagSelector
        showManageTags
        label={`${contact.display_name}'s Tags`}
        anchorRenderer={onClick =>
          hasTags ? (
            <Chip
              label="Edit Tags"
              variant="outlined"
              color="secondary"
              size="small"
              className={classes.editTag}
              onClick={onClick}
            />
          ) : (
            <Box className={classes.addTag} onClick={onClick}>
              <SvgIcon path={mdiTagOutline} size={muiIconSizes.small} />
              <Typography variant="body2" className={classes.label}>
                Add Tags
              </Typography>
            </Box>
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
