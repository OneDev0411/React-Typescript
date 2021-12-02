import { BaseTagSelector } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

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
  const handleChange = async (value: SelectorOption[]) =>
    onChange(value.map(tag => tag.title))

  return (
    <BaseTagSelector
      {...otherProps}
      value={value.map(tag => ({
        title: tag,
        value: tag
      }))}
      onChange={handleChange}
      chipProps={{ size: 'small', variant: 'outlined' }}
      textFieldProps={{
        label: 'Tags',
        placeholder: 'Add Tags to participate to this Campaign',
        autoFocus,
        error,
        helperText,
        InputLabelProps: { shrink: true }
      }}
    />
  )
}

export default SuperCampaignTagsField
