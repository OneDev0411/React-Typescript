import useSafeState from '@app/hooks/use-safe-state'
import {
  PopoverContactTagSelector,
  PopoverContactTagSelectorProps
} from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

export interface SuperCampaignTagsPopoverProps
  extends Pick<
    PopoverContactTagSelectorProps,
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
  const [isSaving, setIsSaving] = useSafeState(false)

  const handleTagsChange = async (tags: SelectorOption[]) => {
    setIsSaving(true)
    await onTagsChange(tags.map(tag => tag.title))
    setIsSaving(false)
  }

  return (
    <PopoverContactTagSelector
      {...otherProps}
      value={tags.map(tag => ({
        title: tag,
        value: tag
      }))}
      filter={
        {
          // selectedIds: [contact.id] // TODO: Hamed jan, please do not forget to fix this
        }
      }
      callback={handleTagsChange}
      disabled={isSaving}
    />
  )
}

export default SuperCampaignTagsPopover
