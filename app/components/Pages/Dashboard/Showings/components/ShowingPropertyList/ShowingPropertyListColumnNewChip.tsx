import { Box, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.error.main,
      borderRadius: '50%',
      textAlign: 'center',
      color: theme.palette.common.white,
      display: 'inline-flex',
      height: theme.spacing(3),
      minWidth: theme.spacing(3),
      padding: theme.spacing(0, 0.5),
      alignItems: 'center',
      justifyContent: 'center'
    }
  }),
  { name: 'ShowingPropertyListColumnNewChip' }
)

interface ShowingPropertyListColumnNewChipProps {
  count: number
}

function ShowingPropertyListColumnNewChip({
  count
}: ShowingPropertyListColumnNewChipProps) {
  const classes = useStyles()

  if (count < 1) {
    return null
  }

  return (
    <Box>
      <div className={classes.root}>{count}</div>
    </Box>
  )
}

export default ShowingPropertyListColumnNewChip
