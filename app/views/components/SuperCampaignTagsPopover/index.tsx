import {
  PopoverTagSelector,
  PopoverTagSelectorProps
} from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

export interface SuperCampaignTagsPopoverProps
  extends Pick<
    PopoverTagSelectorProps,
    'anchorRenderer' | 'defaultIsDirty' | 'minimumTag'
  > {
  tags: string[]
  onTagsChange: (tags: string[]) => Promise<void>
}

function SuperCampaignTagsPopover({
  tags,
  onTagsChange,
  ...otherProps
}: SuperCampaignTagsPopoverProps) {
  const handleTagsChange = async (tags: SelectorOption[]) =>
    onTagsChange(tags.map(tag => tag.title))

  return (
    <PopoverTagSelector
      {...otherProps}
      value={tags.map(tag => ({
        title: tag,
        value: tag
      }))}
      onSave={handleTagsChange}
    />
  )
}

export default SuperCampaignTagsPopover
