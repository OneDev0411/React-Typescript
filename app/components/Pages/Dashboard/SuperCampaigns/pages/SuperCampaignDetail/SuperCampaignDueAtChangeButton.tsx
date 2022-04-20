import { Button } from '@material-ui/core'
import { mdiCalendarBlankOutline } from '@mdi/js'

import {
  convertDateToTimestamp,
  convertTimestampToDate
} from '@app/utils/date-utils'
import { futureTimeValidator } from '@app/utils/validations/future-time'
import { DateTimePicker } from '@app/views/components/DateTimePicker'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

export interface SuperCampaignDueAtChangeButtonProps {
  dueAt: Nullable<number>
  onDueAtChange: (dueAt: number) => void
  isSaving: boolean
}

function SuperCampaignDueAtChangeButton({
  dueAt,
  onDueAtChange,
  isSaving
}: SuperCampaignDueAtChangeButtonProps) {
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
      validate={futureTimeValidator}
    >
      {({ handleOpen }) => (
        <Button
          color="secondary"
          size="small"
          startIcon={
            <SvgIcon path={mdiCalendarBlankOutline} size={muiIconSizes.small} />
          }
          onClick={handleOpen}
          disabled={isSaving}
        >
          {!dueAt ? 'Schedule' : 'Change'}
        </Button>
      )}
    </DateTimePicker>
  )
}

export default SuperCampaignDueAtChangeButton
