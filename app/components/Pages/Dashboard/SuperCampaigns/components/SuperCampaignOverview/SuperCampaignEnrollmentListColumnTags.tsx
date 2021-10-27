import { Chip, makeStyles, Tooltip } from '@material-ui/core'

import useSafeState from '@app/hooks/use-safe-state'
import { PopoverContactTagSelector } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

const useStyles = makeStyles(
  theme => ({
    tag: { marginRight: theme.spacing(0.5) }
  }),
  { name: 'SuperCampaignEnrollmentListColumnTags' }
)

interface SuperCampaignEnrollmentListColumnTagsProps {
  isOptedOut: boolean
  tags: string[]
  onTagsChange: (tags: string[]) => Promise<void>
}

function SuperCampaignEnrollmentListColumnTags({
  isOptedOut,
  tags,
  onTagsChange
}: SuperCampaignEnrollmentListColumnTagsProps) {
  const classes = useStyles()
  const [isSaving, setIsSaving] = useSafeState(false)

  const handleTagsChange = async (tags: SelectorOption[]) => {
    setIsSaving(true)
    await onTagsChange(tags.map(tag => tag.title))
    setIsSaving(false)
  }

  if (isOptedOut) {
    return null
  }

  return (
    <PopoverContactTagSelector
      value={tags.map(tag => ({
        title: tag,
        value: tag
      }))}
      filter={
        {
          // selectedIds: [contact.id] // TODO: Ask Hamed about this
        }
      }
      callback={handleTagsChange}
      disabled={isSaving}
      anchorRenderer={onClick => (
        <Tooltip title="Click to edit">
          <span onClick={onClick}>
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  className={classes.tag}
                />
              ))
            ) : (
              <Chip label="No Tags" size="small" />
            )}
          </span>
        </Tooltip>
      )}
    />
  )
}

export default SuperCampaignEnrollmentListColumnTags
