import { Typography, makeStyles } from '@material-ui/core'

import { TagSelectorTextField } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

const useStyles = makeStyles(
  theme => ({
    focused: { '& $label': { color: theme.palette.primary.main } },
    label: {
      color: theme.palette.grey[600],
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'SuperCampaignTagsField' }
)

export interface SuperCampaignTagsFieldProps {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  autoFocus?: boolean
  error?: boolean
  helperText?: string
}

function SuperCampaignTagsField({
  value,
  onChange,
  autoFocus,
  error,
  helperText,
  ...otherProps
}: SuperCampaignTagsFieldProps) {
  const classes = useStyles()

  const handleChange = async (value: SelectorOption[]) =>
    onChange(value.map(tag => tag.title))

  return (
    <TagSelectorTextField
      {...otherProps}
      value={value.map(tag => ({
        title: tag,
        value: tag
      }))}
      onChange={handleChange}
      chipProps={{ size: 'small', variant: 'outlined' }}
      textFieldProps={params => ({
        ...params,
        placeholder: 'Add Tags to participate to this Campaign',
        autoFocus,
        error,
        helperText,
        InputLabelProps: { ...params.InputLabelProps, shrink: true },
        InputProps: {
          ...params.InputProps,
          startAdornment: (
            <>
              <Typography
                className={classes.label}
                variant="body2"
                component="span"
              >
                Tags
              </Typography>
              {params.InputProps.startAdornment}
            </>
          ),
          classes: { focused: classes.focused }
        }
      })}
    />
  )
}

export default SuperCampaignTagsField
