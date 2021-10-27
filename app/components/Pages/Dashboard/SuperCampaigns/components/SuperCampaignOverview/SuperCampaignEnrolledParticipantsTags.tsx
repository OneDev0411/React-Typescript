import { makeStyles } from '@material-ui/core'

import { BaseTagSelector } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

const useStyles = makeStyles(
  theme => ({
    readOnly: { pointerEvents: 'none' },
    chip: { backgroundColor: theme.palette.common.white },
    chipDeleteIcon: { display: 'none' }
  }),
  { name: 'SuperCampaignEnrolledParticipantsTags' }
)

interface SuperCampaignEnrolledParticipantsTagsProps {
  value: Nullable<string[]>
  onChange: (value: string[]) => void
  disabled: boolean
  readOnly: boolean
  helperText?: string
}

function SuperCampaignEnrolledParticipantsTags({
  value,
  onChange,
  disabled,
  readOnly,
  helperText
}: SuperCampaignEnrolledParticipantsTagsProps) {
  const classes = useStyles()
  const stringValue = value?.map(tag => ({ title: tag, value: tag })) ?? []

  const handleChange = (tags: SelectorOption[]) =>
    onChange(tags.map(tag => tag.title))

  return (
    <BaseTagSelector
      className={readOnly ? classes.readOnly : undefined}
      value={stringValue}
      onChange={handleChange}
      chipProps={{
        size: 'small',
        variant: 'outlined',
        className: classes.chip,
        classes: { deleteIcon: readOnly ? classes.chipDeleteIcon : undefined }
      }}
      textFieldProps={{
        placeholder: !readOnly ? 'Search or create tags...' : undefined,
        variant: 'filled',
        helperText,
        label: 'Tags'
      }}
      disabled={disabled}
    />
  )
}

export default SuperCampaignEnrolledParticipantsTags
