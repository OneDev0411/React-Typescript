import { Button } from '@material-ui/core'
import { mdiCalendarBlankOutline } from '@mdi/js'

import {
  convertDateToTimestamp,
  convertTimestampToDate
} from '@app/utils/date-utils'
import { DateTimePicker } from '@app/views/components/DateTimePicker'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { futureTimeValidator } from '../../helpers'

export interface SuperCampaignDetailHeaderScheduleButtonProps {
  dueAt: Optional<number>
  onDueAtChange: (dueAt: number) => void
  isSaving: boolean
}

function SuperCampaignDetailHeaderScheduleButton({
  dueAt,
  onDueAtChange,
  isSaving
}: SuperCampaignDetailHeaderScheduleButtonProps) {
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
          Change
        </Button>
      )}
    </DateTimePicker>
  )
}

export default SuperCampaignDetailHeaderScheduleButton
