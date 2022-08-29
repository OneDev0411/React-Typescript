import { OutlinedInput, Theme, makeStyles } from '@material-ui/core'

import DatePicker from '@app/views/components/DatePicker'

interface Props {
  operator: IFilterOperator
  onChange: (timestamp: number) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    relativeContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    label: {
      paddingLeft: theme.spacing(1)
    },
    inputContainer: {
      flexGrow: 1
    },
    input: {
      padding: theme.spacing(1.25)
    },
    absoluteContainer: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: `${theme.shape.borderRadius}px`
    }
  }),
  {
    name: 'DateOperatorComponent'
  }
)

export const DateOperatorComponent = ({ operator, onChange }: Props) => {
  const classes = useStyles()

  const handleChange = (date: Date) => {
    console.log('handleChange', { dd: date.getTime() / 1000 })
    onChange(date.getTime() / 1000)
  }

  if (operator.name === 'relative') {
    return (
      <div className={classes.relativeContainer}>
        <OutlinedInput
          type="number"
          labelWidth={0}
          inputProps={{
            min: '1'
          }}
          classes={{
            root: classes.inputContainer,
            input: classes.input
          }}
          // onChange={handleChange}
        />
        <span className={classes.label}>days ago</span>
      </div>
    )
  }

  return (
    <div className={classes.absoluteContainer}>
      <DatePicker onChange={handleChange} />
    </div>
  )
}
