import { Box, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    types: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingRoleListColumnMediums' }
)

interface ShowingRoleListColumnMediumsProps {
  label: string
  types: INotificationDeliveryType[]
}

function ShowingRoleListColumnMediums({
  label,
  types
}: ShowingRoleListColumnMediumsProps) {
  const classes = useStyles()

  const mediums = [
    types.includes('email') ? 'Email' : '',
    types.includes('sms') ? 'Text' : '',
    types.includes('push') ? 'Mobile App' : ''
  ].filter(medium => !!medium)

  return (
    <>
      <Typography noWrap variant="caption" component="span">
        <Box color="grey.600" component="span">
          {label}
        </Box>
      </Typography>
      <Typography className={classes.types} variant="body2" component="span">
        {mediums.join(', ') || '—'}
      </Typography>
    </>
  )
}

export default ShowingRoleListColumnMediums
