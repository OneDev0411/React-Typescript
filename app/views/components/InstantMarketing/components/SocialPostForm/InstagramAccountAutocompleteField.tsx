import {
  TextField,
  Chip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  makeStyles
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Field, FieldProps, FieldRenderProps } from 'react-final-form'

import { useGetActiveBrandFacebookPages } from '@app/models/facebook'

import InstagramAccountPaperWithManageAccountLink from './InstagramAccountPaperWithManageAccountLink'

const useStyles = makeStyles(
  theme => ({
    avatar: {
      width: theme.spacing(3),
      height: theme.spacing(3)
    },
    listItemAvatar: { minWidth: theme.spacing(4) }
  }),
  { name: 'InstagramAccountAutocompleteField' }
)

type InstagramAccountAutocompleteFieldProps = Pick<
  FieldProps<IFacebookPage, FieldRenderProps<IFacebookPage>>,
  'name' | 'validate'
>

function InstagramAccountAutocompleteField(
  props: InstagramAccountAutocompleteFieldProps
) {
  const classes = useStyles()

  const { data: facebookPages, isLoading } = useGetActiveBrandFacebookPages()

  if (isLoading) {
    return null
  }

  const getOptionLabel = (option: IFacebookPage) =>
    option.instagram_username || ''

  return (
    <Field<IFacebookPage>
      {...props}
      render={({ input, meta }) => {
        const showError =
          ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
          meta.touched

        return (
          <Autocomplete
            value={input.value}
            onChange={(_, value) => input.onChange(value)}
            options={facebookPages ?? []}
            getOptionLabel={getOptionLabel}
            filterSelectedOptions
            disableClearable
            size="small"
            renderOption={tag => (
              <>
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Avatar
                    className={classes.avatar}
                    alt={getOptionLabel(tag)}
                    src={tag.instagram_profile_picture_url}
                  />
                </ListItemAvatar>
                <ListItemText primary={getOptionLabel(tag)} />
              </>
            )}
            renderTags={(tags, getTagProps) => {
              return tags.map((tag, index) => (
                <Chip
                  key={tag.id}
                  avatar={
                    <Avatar
                      alt={getOptionLabel(tag)}
                      src={tag.instagram_profile_picture_url}
                    />
                  }
                  label={getOptionLabel(tag)}
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                label="Instagram Account"
                helperText={showError ? meta.error || meta.submitError : ''}
                error={showError}
              />
            )}
            PaperComponent={InstagramAccountPaperWithManageAccountLink}
          />
        )
      }}
    />
  )
}

export default InstagramAccountAutocompleteField
