import React, { ReactNode, MouseEvent, useState } from 'react'
import {
  Box,
  Button,
  Popover,
  Typography,
  PopoverProps,
  makeStyles,
  Theme
} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'

import { mdiCogOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { bulkTag } from 'models/contacts/bulk-tag'
import {
  generateContactFilters,
  ContactFilterGenerator
} from 'models/contacts/bulk-tag/utils/generate-contact-filters'
import { getContactsTags } from 'actions/contacts'

import { noop } from 'utils/helpers'

import {
  BaseTagSelector,
  Props as BaseTagSelectorProps
} from './BaseTagSelector'
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
    textField: {
      '& .MuiAutocomplete-inputRoot': {
        padding: theme.spacing(0.5),
        ...theme.typography.body2
      }
    },
    actionsContainer: {
      marginTop: theme.spacing(1),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      direction: 'rtl'
    },
    manageTags: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1.25, 2),
      background: theme.palette.grey[100],
      color: theme.palette.tertiary.dark,
      ...theme.typography.button,
      '&:hover': {
        textDecoration: 'none'
      }
    },
    manageTagsIcon: {
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'PopoverContactTagSelector' }
)

interface Props extends Omit<BaseTagSelectorProps, 'onChange'> {
  label?: string
  filter: ContactFilterGenerator
  popoverProps?: Omit<PopoverProps, 'open' | 'anchorEl' | 'onClose'>
  showManageTags?: boolean
  anchorRenderer: (onClick: (e: MouseEvent<HTMLElement>) => void) => ReactNode
  callback?: (tags: SelectorOption[]) => void
}

export const PopoverContactTagSelector = ({
  showManageTags = false,
  popoverProps = {},
  callback = noop,
  anchorRenderer,
  value = [],
  filter,
  label,
  ...props
}: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [hasNewTag, setHasNewTag] = useState<boolean>(false)
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
  const handleChange = (tags: SelectorOption[], newTag: boolean) => {
    if (!isDirty) {
      setIsDirty(true)
    }

    if (newTag !== hasNewTag) {
      setHasNewTag(newTag)
    }

    setSelectedTags(tags)
  }
  const handleSave = async () => {
    if (isDirty) {
      setIsDirty(false)
    }

    try {
      setIsSaving(true)

      const tags = selectedTags.map(tag => tag.title)
      const bulkFilter = generateContactFilters(filter)

      await bulkTag(tags, bulkFilter)

      if (hasNewTag) {
        dispatch(getContactsTags())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
      setAnchorEl(null)
    }

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
          <Typography variant="button" className={classes.label}>
            {label || 'Tags'}
          </Typography>
          <BaseTagSelector
            {...props}
            chipProps={{
              variant: 'outlined',
              size: 'small'
            }}
            textFiledProps={{
              autoFocus: true,
              variant: 'outlined',
              className: classes.textField
            }}
            value={value}
            onChange={handleChange}
          />
          <Box className={classes.actionsContainer}>
            <Box flexGrow={1}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                size="small"
                disabled={!isDirty || isSaving}
                onClick={handleSave}
              >
                {isSaving ? 'Saving' : 'Done'}
              </Button>
            </Box>
            <Box flexGrow={1} mr={0.5}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
        {showManageTags && (
          <Box>
            <Link
              to="/dashboard/account/manage-tags"
              className={classes.manageTags}
            >
              <SvgIcon
                path={mdiCogOutline}
                size={muiIconSizes.small}
                className={classes.manageTagsIcon}
              />
              Manage Tags
            </Link>
          </Box>
        )}
      </Popover>
    </>
  )
}
