import React, { ReactNode, MouseEvent, useState, memo } from 'react'
import {
  Box,
  Button,
  Popover,
  Typography,
  PopoverProps,
  makeStyles,
  fade,
  Theme
} from '@material-ui/core'

import { bulkTag } from 'models/contacts/bulk-tag'
import {
  generateContactFilters,
  ContactFilterGenerator
} from 'models/contacts/bulk-tag/utils/generate-contact-filters'
import { noop } from 'utils/helpers'

import {
  BaseContactTagSelector,
  Props as BaseContactTagSelectorProps
} from './BaseContactTagSelector'
import { SelectorOption } from '../type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(1),
      width: '320px'
    },
    label: {
      display: 'inline-block',
      marginBottom: theme.spacing(0.5)
    },
    actions: {
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      borderTop: `1px solid ${fade(theme.palette.tertiary.dark, 0.12)}`,
      direction: 'rtl'
    }
  }),
  { name: 'PopoverContactTagSelector' }
)

interface Props
  extends Omit<BaseContactTagSelectorProps, 'selectedIds' | 'onChange'> {
  filter: ContactFilterGenerator
  popoverProps?: Omit<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
  anchorRenderer: (onClick: (e: MouseEvent<HTMLElement>) => void) => ReactNode
  callback?: (tags: SelectorOption[]) => void
}

export const PopoverContactTagSelectorContainer = ({
  anchorRenderer,
  popoverProps = {},
  value = [],
  callback = noop,
  filter,
  ...props
}: Props) => {
  const classes = useStyles()
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)
  const [selectedTags, setSelectedTags] = useState<SelectorOption[]>(value)
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleChange = (tags: SelectorOption[]) => {
    if (!isDirty) {
      setIsDirty(true)
    }

    setSelectedTags(tags)
  }
  const handleSave = async () => {
    return console.log('handleSave',{filter, payload: generateContactFilters(filter)})
    if (isDirty) {
      setIsDirty(false)
    }

    try {
      setIsSaving(true)

      const tags = selectedTags.map(tag => tag.title)
      const bulkFilter = generateContactFilters(filter)
      const response = await bulkTag(tags, bulkFilter)

      console.log(response)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
      setAnchorEl(null)
    }

    console.log('handleSave', selectedTags)

    callback(selectedTags)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'popover-tag-selector' : undefined

  return (
    <>
      {anchorRenderer(handleClick)}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        {...popoverProps}
      >
        <Box className={classes.container}>
          <Typography variant="caption" className={classes.label}>Tags</Typography>
          <BaseContactTagSelector
            {...props}
            selectedIds={filter.selectedIds || []}
            chipProps={{
              variant: 'outlined',
              size: 'small'
            }}
            value={selectedTags}
            onChange={handleChange}
          />
          <Box className={classes.actions}>
            <Box>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                // disabled={!isDirty || isSaving}
                onClick={handleSave}
              >
                {isSaving ? 'Saving' : 'Done'}
              </Button>
            </Box>
            <Box mr={0.5}>
              <Button variant="outlined" size="small" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export const PopoverContactTagSelector = memo(
  PopoverContactTagSelectorContainer
)
