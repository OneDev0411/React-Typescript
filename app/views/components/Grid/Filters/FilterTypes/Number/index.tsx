import { OutlinedInput, Theme, makeStyles } from '@material-ui/core'

interface Props {
  operator: IFilterOperator
  onChange: (timestamp: number) => void
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
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
    }
  }),
  {
    name: 'NumberFilterType'
  }
)

export const NumberFilterType = ({ operator, onChange }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
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
