import { Button } from '@material-ui/core'
import { mdiClockOutline } from '@mdi/js'

import {
  convertDateToTimestamp,
  convertTimestampToDate
} from '@app/utils/date-utils'
import { DateTimePicker } from '@app/views/components/DateTimePicker'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

export interface SuperCampaignDetailHeaderScheduleButtonProps {
  className: string
  isExecuted: boolean
  dueAt: Optional<number>
  onDueAtChange: (dueAt: number) => void
  isSaving: boolean
}

function SuperCampaignDetailHeaderScheduleButton({
  className,
  isExecuted,
  dueAt,
  onDueAtChange,
  isSaving
}: SuperCampaignDetailHeaderScheduleButtonProps) {
  if (isExecuted) {
    return null
  }

  const isDraft = !dueAt

  const selectedDate = dueAt ? convertTimestampToDate(dueAt) : new Date()

  const handleChange = (date: Nullable<Date>) => {
    if (!date) {
      return
    }

    const newValue = convertDateToTimestamp(date)

    if (newValue === dueAt) {
      return
    }

    onDueAtChange(newValue)
  }

  return (
    <DateTimePicker
      onClose={handleChange}
      selectedDate={selectedDate}
      showTimePicker
      defaultSelectedDate={selectedDate}
      datePickerModifiers={{
        disabled: {
          before: new Date()
        }
      }}
    >
      {({ handleOpen }) => (
        <Button
          className={className}
          color={isDraft ? 'primary' : undefined}
          variant={isDraft ? 'contained' : 'outlined'}
          size="small"
          startIcon={
            isDraft && (
              <SvgIcon path={mdiClockOutline} size={muiIconSizes.small} />
            )
          }
          onClick={handleOpen}
          disabled={isSaving}
        >
          {isDraft ? 'Schedule' : 'Change Date and Time'}
        </Button>
      )}
    </DateTimePicker>
  )
}

export default SuperCampaignDetailHeaderScheduleButton
