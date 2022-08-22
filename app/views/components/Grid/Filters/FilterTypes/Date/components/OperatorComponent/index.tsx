import { OutlinedInput, Theme, makeStyles } from '@material-ui/core'

import DatePicker from '@app/views/components/DatePicker'

import { DateOperator } from '../../types'

interface Props {
  operator: DateOperator
  onChange?: () => void
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
    name: 'OperatorComponent'
  }
)

export const OperatorComponent = ({ operator }: Props) => {
  const classes = useStyles()

  const handleChange = dd => {
    console.log('handleChange', { dd })
  }

  if (operator.type === 'relative') {
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
          onChange={handleChange}
        />
        <span className={classes.label}>days ago</span>
      </div>
    )
  }

  if (operator.type === 'absolute') {
    return (
      <div className={classes.absoluteContainer}>
        <DatePicker onChange={handleChange} />
      </div>
    )
  }

  return null
}
