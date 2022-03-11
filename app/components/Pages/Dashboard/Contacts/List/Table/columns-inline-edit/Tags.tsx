import { useMemo, useState } from 'react'

import {
  Chip,
  makeStyles,
  MenuItem,
  InputBase,
  Typography,
  Box
} from '@material-ui/core'
import { mdiCogOutline } from '@mdi/js'
import matchSorter from 'match-sorter'
import { useSelector } from 'react-redux'

import { IAppState } from '@app/reducers'
import ALink from '@app/views/components/ALink'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      position: 'relative',
      width: '400px',
      height: '400px',
      overflowY: 'auto'
    },
    current: {
      position: 'sticky',
      top: 0,
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.grey['50'],
      borderBottom: `2px solid ${theme.palette.primary.main}`,
      zIndex: 1
    },
    tagChip: {
      border: `1px solid ${theme.palette.grey['300']}`,
      backgroundColor: '#fff',
      margin: theme.spacing(0, 0.5, 0.5, 0)
    },
    list: {
      minHeight: '250px',
      borderBottom: `1px solid ${theme.palette.action.disabledBackground}`
    },
    listTitle: {
      backgroundColor: '#fff',
      color: theme.palette.grey['600'],
      padding: theme.spacing(1, 2)
    },
    manageTags: {
      position: 'sticky',
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1, 1),
      color: theme.palette.tertiary.dark,
      backgroundColor: theme.palette.grey['50'],
      zIndex: 1
    },
    createTag: {
      cursor: 'pointer',
      fontWeight: 500
    },
    manageTagsIcon: {
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'TagsInlineEdit' }
)

interface Props {
  contact: IContact
}

export function TagsInlineEdit({ contact }: Props) {
  const classes = useStyles()
  const [selectedTags, setSelectedTags] = useState<string[]>(contact.tags ?? [])
  const [searchCriteria, setSearchCriteria] = useState('')
  const availableTags = useSelector<IAppState, IContactTag[]>(
    ({ contacts }) => contacts.tags.byId
  )

  const handleRemove = (tag: string) => {
    setSelectedTags(current => current.filter(item => item !== tag))
  }

  const handleAdd = (tag: string) => {
    setSelectedTags(current => [...current, tag])
    setSearchCriteria('')
  }

  const tagsList = useMemo(() => {
    const base = Object.values(availableTags).filter(
      tag => !selectedTags.includes(tag.text)
    )

    return searchCriteria
      ? matchSorter(base, searchCriteria, {
          keys: ['text']
        })
      : base
  }, [availableTags, selectedTags, searchCriteria])

  return (
    <div className={classes.root}>
      <div className={classes.current}>
        {selectedTags.map(tag => (
          <Chip
            key={tag}
            className={classes.tagChip}
            label={<Typography variant="body2">{tag}</Typography>}
            onDelete={() => handleRemove(tag)}
          />
        ))}

        {selectedTags.length === 0 && (
          <Box textAlign="center" m={2}>
            <Typography variant="body2">No tag is Selected</Typography>
          </Box>
        )}

        <InputBase
          autoFocus
          fullWidth
          value={searchCriteria}
          onChange={e => setSearchCriteria(e.target.value)}
        />
      </div>

      <div className={classes.list}>
        <Typography variant="body2" className={classes.listTitle}>
          Select tags or create a new one
        </Typography>

        {tagsList.map(tag => (
          <MenuItem key={tag.id} onClick={() => handleAdd(tag.text)}>
            {tag.text}
          </MenuItem>
        ))}

        {tagsList.length === 0 && (
          <Box pl={2}>
            <Typography
              variant="subtitle1"
              color="primary"
              className={classes.createTag}
              onClick={() => handleAdd(searchCriteria)}
            >
              Create "{searchCriteria}"
            </Typography>
          </Box>
        )}
      </div>

      <div className={classes.manageTags}>
        <ALink
          to="/dashboard/account/manage-tags"
          className={classes.manageTags}
        >
          <SvgIcon
            path={mdiCogOutline}
            size={muiIconSizes.small}
            className={classes.manageTagsIcon}
          />
          Manage Tags
        </ALink>
      </div>
    </div>
  )
}
