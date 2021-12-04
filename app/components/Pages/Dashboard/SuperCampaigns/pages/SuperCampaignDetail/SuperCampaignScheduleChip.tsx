import { Chip, CircularProgress } from '@material-ui/core'
import { mdiCheck, mdiEmailCheck, mdiEmailOutline } from '@mdi/js'
import format from 'date-fns/format'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface SuperCampaignScheduleChipProps {
  isExecuted: Boolean
  dueAt: Optional<number>
  isSaving: boolean
}

function SuperCampaignScheduleChip({
  isExecuted,
  dueAt,
  isSaving
}: SuperCampaignScheduleChipProps) {
  const getLabelIcon = () => {
    if (!dueAt) {
      return {
        label: 'Draft Campaign, Schedule a time to send it out',
        icon: mdiCheck
      }
    }

    const formattedDate = format(
      dueAt * 1000,
      "EEEE, LLL dd, yyyy 'at' hh:mmaaa"
    )

    if (isExecuted) {
      return {
        label: `Sent on ${formattedDate}`,
        icon: mdiEmailCheck
      }
    }

    return {
      label: `Scheduled to send on ${formattedDate}`,
      icon: mdiEmailOutline
    }
  }

  const { label, icon } = getLabelIcon()

  return (
    <Chip
      label={label}
      size="small"
      icon={
        isSaving ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <SvgIcon path={icon} size={muiIconSizes.small} />
        )
      }
    />
  )
}

export default SuperCampaignScheduleChip
