// TODO: implement Filter section using generic filter builder
// https://gitlab.com/rechat/web/-/issues/5476

import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import TuneIcon from '@material-ui/icons/Tune'
import cn from 'classnames'

import { BathsEditor } from './bathsEditor'
import { BedsEditor } from './bedsEditor'
import { PriceEditor } from './priceEditor'
import { useStyles } from './styles'

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
      <PriceEditor />
      <BedsEditor />
      <BathsEditor />
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
