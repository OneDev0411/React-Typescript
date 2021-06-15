import { mdiPlus } from '@mdi/js'

import { Box, IconButton, makeStyles } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  theme => ({
    line: {
      backgroundColor: theme.palette.primary.main,
      height: 2,
      width: 'calc(100% - 8px)'
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
    <Box
      className={className}
      position="relative"
      height="24px"
      onClick={onClick}
    >
      <Box position="absolute" left="-34px" top="0">
        <IconButton size="small">
          <SvgIcon path={mdiPlus} size={muiIconSizes.medium} />
        </IconButton>
      </Box>
      <Box className={classes.line} position="absolute" top="50%" left="4px" />
    </Box>
  )
}

export default ShowingAvailabilitiesTimesRowInsert
