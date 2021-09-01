import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined'
import HotelOutlinedIcon from '@material-ui/icons/HotelOutlined'
import { makeStyles } from '@material-ui/styles'
import cn from 'classnames'

const useStyles = makeStyles(
  theme => ({
    button: {
      margin: theme.spacing(0, 0.5)
    }
  }),
  { name: 'FiltersBadge' }
)

export const Filters = () => {
  const classes = useStyles()

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        className={cn({
          [classes.button]: true,
          active: true
        })}
      >
        <FiberManualRecordOutlinedIcon fontSize="small" />
        For Sale
      </Button>
      <Button
        variant="outlined"
        size="small"
        className={cn({
          [classes.button]: true,
          active: true
        })}
      >
        <AttachMoneyOutlinedIcon fontSize="small" />
        Any Price
      </Button>
      <Button className={classes.button} variant="outlined" size="small">
        <HotelOutlinedIcon fontSize="small" />
      </Button>
      <Button className={classes.button} variant="outlined" size="small">
        <BathtubOutlinedIcon fontSize="small" />
      </Button>
      <Button className={classes.button} variant="outlined" size="small">
        <AddIcon fontSize="small" />
        More
      </Button>
      <Button className={classes.button} variant="text" size="small">
        Reset All
      </Button>
    </>
  )
}
