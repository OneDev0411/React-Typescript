import {
  Grid,
  Button,
  ButtonGroup,
  makeStyles,
  Tooltip
} from '@material-ui/core'
import { mdiClose, mdiArrowRight, mdiArrowLeft } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons'

const useStyles = makeStyles(
  theme => ({
    root: { marginLeft: theme.spacing(2) },
    button: { minWidth: '40px', padding: theme.spacing(0.75, 1) },
    groupButton: { marginRight: theme.spacing(2) }
  }),
  { name: 'ContactDetailsModalActions' }
)

export interface ContactDetailsModalActionsProps {
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  isNavigable?: boolean
}

export function ContactDetailsModalActions({
  onPrevious,
  onNext,
  onClose,
  isNavigable = false
}: ContactDetailsModalActionsProps) {
  const classes = useStyles()

  return (
    <Grid className={classes.root} container alignItems="center" wrap="nowrap">
      {isNavigable && (
        <Grid item>
          <ButtonGroup
            className={classes.groupButton}
            color="default"
            aria-label="navigation"
          >
            <Tooltip title="Previous contact">
              <Button
                className={classes.button}
                variant="outlined"
                onClick={onPrevious}
              >
                <SvgIcon path={mdiArrowLeft} />
              </Button>
            </Tooltip>
            <Tooltip title="Next contact">
              <Button
                className={classes.button}
                variant="outlined"
                onClick={onNext}
              >
                <SvgIcon path={mdiArrowRight} />
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Grid>
      )}
      <Grid item>
        <Tooltip title="Close">
          <Button className={classes.button} variant="text" onClick={onClose}>
            <SvgIcon path={mdiClose} />
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
