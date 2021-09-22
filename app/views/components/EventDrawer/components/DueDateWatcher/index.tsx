import { FieldWatcher } from 'components/final-form-fields'

interface Props {
  dueDate: Date
  endDate: Nullable<Date>
  onEndDateChange: (date: Date) => void
  isEndDateTouchedManually: boolean
  isEndTimeTouchedManually: boolean
}

export const DueDateWatcher = ({
  dueDate,
  endDate,
  onEndDateChange,
  isEndDateTouchedManually,
  isEndTimeTouchedManually
}: Props) => {
  const handleEndDateChange = (value: Date, callback: (date: Date) => void) => {
    onEndDateChange(value)
    callback(value)
  }

  if (endDate == null) {
    return null
  }

  return (
    <FieldWatcher
      set="endDate"
      watch="dueDate"
      setter={onChange => {
        const isDueDateAfterEndDate = dueDate.getTime() >= endDate.getTime()

        if (isEndTimeTouchedManually || isEndDateTouchedManually) {
          if (isDueDateAfterEndDate) {
            // 1 hour after
            const newEndDate = new Date(dueDate.getTime() + 3600000)

            return handleEndDateChange(newEndDate, onChange)
          }

          const newEndDate = new Date(endDate.getTime())

          newEndDate.setFullYear(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate()
          )

          if (dueDate.getTime() >= newEndDate.getTime()) {
            newEndDate.setHours(dueDate.getHours() + 1)
          }

          return handleEndDateChange(newEndDate, onChange)
        }

        // 1 hour after
        const newEndDate = new Date(dueDate.getTime() + 3600000)

        return handleEndDateChange(newEndDate, onChange)
      }}
    />
  )
}
