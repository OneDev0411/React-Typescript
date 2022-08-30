import { Theme, makeStyles } from '@material-ui/core'

import DatePicker from '@app/views/components/DatePicker'

interface Props {
  currentValue: Date
  onChange: (date: Date) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${theme.shape.borderRadius}px`
    }
  }),
  {
    name: 'DateOperatorComponent'
  }
)

export const DateOperatorComponent = ({ currentValue, onChange }: Props) => {
  const classes = useStyles()

  const handleChange = (date: Date) => onChange(date)

  return (
    <div className={classes.container}>
      <DatePicker onChange={handleChange} selectedDate={currentValue} />
    </div>
  )
}
