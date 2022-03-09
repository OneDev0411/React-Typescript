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

import { useGetFacebookPages } from '@app/models/facebook'

const useStyles = makeStyles(
  theme => ({
    avatar: {
      width: theme.spacing(3),
      height: theme.spacing(3)
    },
    listItemAvatar: { minWidth: theme.spacing(4) }
  }),
  { name: 'InstagramAccountsAutocompleteField' }
)

type InstagramAccountsAutocompleteFieldProps = Pick<
  FieldProps<IFacebookPage[], FieldRenderProps<IFacebookPage[]>>,
  'name'
>

function InstagramAccountsAutocompleteField(
  props: InstagramAccountsAutocompleteFieldProps
) {
  const classes = useStyles()

  const { data: facebookPages, isLoading } = useGetFacebookPages()

  if (isLoading) {
    return null
  }

  const getOptionLabel = (option: IFacebookPage) => option.instagram_username

  return (
    <Field<IFacebookPage[]>
      {...props}
      render={({ input, meta }) => (
        <Autocomplete
          value={input.value}
          onChange={(_, value) => input.onChange(value)}
          multiple
          options={facebookPages ?? []}
          getOptionLabel={getOptionLabel}
          filterSelectedOptions
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
                {...getTagProps({ index })}
              />
            ))
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              label="Instagram Account"
            />
          )}
        />
      )}
    />
  )
}

export default InstagramAccountsAutocompleteField
