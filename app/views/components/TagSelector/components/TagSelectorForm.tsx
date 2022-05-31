import { Box, Button, Typography, makeStyles, Theme } from '@material-ui/core'
import { mdiCogOutline } from '@mdi/js'
import { Link } from 'react-router'

import useStateSafe from '@app/hooks/use-safe-state'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { SelectorOption } from '../type'

import {
  TagSelectorTextField,
  TagSelectorTextFieldProps
} from './TagSelectorTextField'

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
  { name: 'TagSelectorForm' }
)

export interface TagSelectorFormProps
  extends Omit<TagSelectorTextFieldProps, 'onChange'> {
  label?: string
  showManageTags?: boolean
  onSave: (tags: SelectorOption[], hasNewTag: boolean) => Promise<void>
  onCancel?: () => void
  callback?: (tags: SelectorOption[], hasNewTag: boolean) => void
  defaultIsDirty?: boolean
  minimumTag?: number
}

export const TagSelectorForm = ({
  showManageTags = false,
  onSave,
  onCancel,
  callback,
  value = [],
  label = 'Tags',
  defaultIsDirty = false,
  minimumTag = 0,
  ...props
}: TagSelectorFormProps) => {
  const classes = useStyles()
  const [isDirty, setIsDirty] = useStateSafe<boolean>(defaultIsDirty)
  const [isSaving, setIsSaving] = useStateSafe<boolean>(defaultIsDirty)
  const [hasNewTag, setHasNewTag] = useStateSafe<boolean>(false)
  const [selectedTags, setSelectedTags] = useStateSafe<SelectorOption[]>(value)

  const handleChange = (tags: SelectorOption[], newTag: boolean) => {
    setIsDirty(true)

    if (newTag !== hasNewTag) {
      setHasNewTag(newTag)
    }

    setSelectedTags(tags)
  }

  const handleSave = async () => {
    try {
      setIsDirty(false)
      setIsSaving(true)
      await onSave(selectedTags, hasNewTag)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
      onCancel?.()
      callback?.(selectedTags, hasNewTag)
    }
  }

  return (
    <>
      <Box className={classes.container}>
        <Typography variant="button" className={classes.label}>
          {label}
        </Typography>
        <TagSelectorTextField
          {...props}
          chipProps={{
            variant: 'outlined',
            size: 'small'
          }}
          textFieldProps={params => ({
            ...params,
            autoFocus: true,
            variant: 'outlined',
            className: classes.textField
          })}
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
              disabled={
                !isDirty || isSaving || minimumTag > selectedTags.length
              }
              onClick={handleSave}
            >
              {isSaving ? 'Saving' : 'Done'}
            </Button>
          </Box>
          {onCancel && (
            <Box flexGrow={1} mr={0.5}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Box>
          )}
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
    </>
  )
}
