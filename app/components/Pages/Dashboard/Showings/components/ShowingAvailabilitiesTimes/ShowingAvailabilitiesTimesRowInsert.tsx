import { IconButton, makeStyles } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'
import classNames from 'classnames'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      cursor: 'pointer',
      '&:hover $line': { backgroundColor: theme.palette.primary.main },
      '&:hover $button': { borderColor: theme.palette.primary.main },
      marginTop: 2,
      marginBottom: 6,
      position: 'relative',
      height: theme.spacing(2)
    },
    line: {
      position: 'absolute',
      backgroundColor: theme.palette.grey[400],
      height: 2,
      width: '100%',
      top: '50%',
      transform: 'translateY(50%)',
      transition: theme.transitions.create('background-color')
    },
    button: {
      position: 'absolute',
      right: -34,
      top: -7,
      border: `2px solid ${theme.palette.grey[400]}`,
      borderRadius: '50%',
      transition: theme.transitions.create('border-color')
    }
  }),
  { name: 'ShowingAvailabilitiesTimesRowInsert' }
)

interface ShowingAvailabilitiesTimesRowInsertProps {
  className?: string
  onClick: () => void
}

function ShowingAvailabilitiesTimesRowInsert({
  className,
  onClick
}: ShowingAvailabilitiesTimesRowInsertProps) {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, className)} onClick={onClick}>
      <div className={classes.button}>
        <IconButton size="small">
          <SvgIcon path={mdiPlus} size={muiIconSizes.medium} />
        </IconButton>
      </div>
      <div className={classes.line} />
    </div>
  )
}

export default ShowingAvailabilitiesTimesRowInsert
