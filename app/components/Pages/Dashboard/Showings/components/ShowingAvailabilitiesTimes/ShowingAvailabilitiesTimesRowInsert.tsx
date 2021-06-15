import { mdiPlus } from '@mdi/js'

import { Box, IconButton, makeStyles } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  theme => ({
    root: {
      opacity: 0,
      transition: theme.transitions.create('opacity'),
      '&:hover': { opacity: 1 }
    },
    line: {
      backgroundColor: theme.palette.primary.main,
      height: 2,
      width: 'calc(100% - 8px)'
    }
  }),
  { name: 'ShowingAvailabilitiesTimesRowInsert' }
)

interface ShowingAvailabilitiesTimesRowInsertProps {
  onClick: () => void
}

function ShowingAvailabilitiesTimesRowInsert({
  onClick
}: ShowingAvailabilitiesTimesRowInsertProps) {
  const classes = useStyles()

  return (
    <Box
      className={classes.root}
      position="relative"
      height="24px"
      onClick={onClick}
    >
      <Box position="absolute" left="-24px" top="0">
        <IconButton size="small">
          <SvgIcon path={mdiPlus} size={muiIconSizes.small} />
        </IconButton>
      </Box>
      <Box className={classes.line} position="absolute" top="50%" left="4px" />
    </Box>
  )
}

export default ShowingAvailabilitiesTimesRowInsert
