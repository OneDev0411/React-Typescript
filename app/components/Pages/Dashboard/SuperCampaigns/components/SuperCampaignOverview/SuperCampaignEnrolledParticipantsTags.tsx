import { makeStyles } from '@material-ui/core'

import { BaseTagSelector } from '@app/views/components/TagSelector'
import { SelectorOption } from '@app/views/components/TagSelector/type'

const useStyles = makeStyles(
  theme => ({
    chip: { backgroundColor: theme.palette.common.white }
  }),
  { name: 'SuperCampaignEnrolledParticipantsTags' }
)

interface SuperCampaignEnrolledParticipantsTagsProps {
  value: Nullable<string[]>
  onChange: (value: string[]) => void
  disabled: boolean
}

function SuperCampaignEnrolledParticipantsTags({
  value,
  onChange,
  disabled
}: SuperCampaignEnrolledParticipantsTagsProps) {
  const classes = useStyles()
  const stringValue = value?.map(tag => ({ title: tag, value: tag })) ?? []

  const handleChange = (tags: SelectorOption[]) =>
    onChange(tags.map(tag => tag.title))

  return (
    <BaseTagSelector
      value={stringValue}
      onChange={handleChange}
      chipProps={{
        size: 'small',
        variant: 'outlined',
        className: classes.chip
      }}
      textFieldProps={{
        placeholder: 'Search or create tags...',
        variant: 'filled',
        helperText: 'XXX agents added by tags you’ve entered.',
        label: 'Tags'
      }}
      disabled={disabled}
    />
  )
}

export default SuperCampaignEnrolledParticipantsTags
