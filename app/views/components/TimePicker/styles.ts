import { makeStyles } from '@material-ui/core'

export default makeStyles({
  input: {
    '& input[type="time"]::-webkit-calendar-picker-indicator': {
      background: 'none'
    }
  }
})
