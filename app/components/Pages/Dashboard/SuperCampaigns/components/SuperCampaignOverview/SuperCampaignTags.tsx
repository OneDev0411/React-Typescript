import { BaseTagSelector } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

interface SuperCampaignTagsProps {
  value: Nullable<string[]>
  onChange: (value: string[]) => void
  disabled: boolean
}

function SuperCampaignTags({
  value,
  onChange,
  disabled
}: SuperCampaignTagsProps) {
  const stringValue = value?.map(tag => ({ title: tag, value: tag })) ?? []

  const handleChange = (tags: SelectorOption[]) =>
    onChange(tags.map(tag => tag.title))

  return (
    <BaseTagSelector
      value={stringValue}
      onChange={handleChange}
      textFieldProps={{ placeholder: 'Search or create tags...' }}
      disabled={disabled}
    />
  )
}

export default SuperCampaignTags
