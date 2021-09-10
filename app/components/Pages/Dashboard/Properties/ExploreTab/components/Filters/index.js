// TODO: implement Filter section using generic filter builder
// https://gitlab.com/rechat/web/-/issues/5476

import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AttachMoneyOutlinedIcon from '@material-ui/icons/AttachMoneyOutlined'
import BathtubOutlinedIcon from '@material-ui/icons/BathtubOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import HotelOutlinedIcon from '@material-ui/icons/HotelOutlined'
import TuneIcon from '@material-ui/icons/Tune'
import { makeStyles } from '@material-ui/styles'
import cn from 'classnames'

const useStyles = makeStyles(
  theme => ({
    button: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0, 0.5)
    },
    resetButton: {
      padding: theme.spacing(1, 2),
      margin: theme.spacing(0, 1, 0, 1.5)
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
        size="medium"
        className={cn({
          [classes.button]: true,
          active: true
        })}
        startIcon={<FiberManualRecordIcon fontSize="small" color="primary" />}
        endIcon={<ExpandMoreIcon fontSize="small" />}
      >
        Sale
      </Button>
      <Button
        variant="outlined"
        size="medium"
        className={cn({
          [classes.button]: true,
          active: true
        })}
        startIcon={<AttachMoneyOutlinedIcon fontSize="small" />}
      >
        Any Price
      </Button>
      <Button
        className={classes.button}
        variant="outlined"
        size="medium"
        startIcon={<HotelOutlinedIcon fontSize="small" />}
      >
        Beds
      </Button>
      <Button
        className={classes.button}
        variant="outlined"
        size="medium"
        startIcon={<BathtubOutlinedIcon fontSize="small" />}
      >
        Baths
      </Button>
      <Button
        className={classes.button}
        variant="outlined"
        size="medium"
        startIcon={<TuneIcon fontSize="small" />}
        endIcon={<AddIcon fontSize="small" />}
      >
        More Filters
      </Button>
      <Button
        className={classes.resetButton}
        variant="outlined"
        disabled
        size="medium"
      >
        Reset Search
      </Button>
    </>
  )
}
