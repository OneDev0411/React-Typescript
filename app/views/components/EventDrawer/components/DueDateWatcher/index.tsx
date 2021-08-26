import { FieldWatcher } from 'components/final-form-fields'

interface Props {
  dueDate: Date
  endDate: Nullable<Date>
  onUpdateEndDate: (date: Date) => void
  isEndDateTouchedManually: boolean
  isEndTimeTouchedManually: boolean
}

export const DueDateWatcher = ({
  dueDate,
  endDate,
  onUpdateEndDate,
  isEndDateTouchedManually,
  isEndTimeTouchedManually
}: Props) => {
  const handleEndDateChane = (value: Date, callback: (date: Date) => void) => {
    onUpdateEndDate(value)
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
        console.log({ dueDate, endDate })

        const isDueDateAfterEndDate = dueDate.getTime() >= endDate.getTime()

        if (isDueDateAfterEndDate) {
          if (!isEndDateTouchedManually) {
            endDate.setFullYear(
              dueDate.getFullYear(),
              dueDate.getMonth(),
              dueDate.getDate()
            )

            // onChange(endDate)
            handleEndDateChane(endDate, onChange)
          } else {
            // 1 hour after
            const newEndDate = new Date(dueDate.getTime() + 3600000)

            handleEndDateChane(newEndDate, onChange)
          }
        }
      }}
    />
  )
}
