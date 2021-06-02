import { Box, Typography } from '@material-ui/core'

interface ShowingRoleListColumnMediumsProps {
  label: string
  types: INotificationDeliveryType[]
}

function ShowingRoleListColumnMediums({
  label,
  types
}: ShowingRoleListColumnMediumsProps) {
  const mediums = [
    types.includes('email') ? 'Email' : '',
    types.includes('sms') ? 'Text' : '',
    types.includes('push') ? 'Mobile App' : ''
  ].filter(medium => !!medium)

  return (
    <div>
      <Typography noWrap variant="caption" component="span">
        <Box color="grey.600" component="span">
          {label}{' '}
        </Box>
      </Typography>
      <Typography variant="body2" component="span">
        {mediums.join(', ')}
      </Typography>
    </div>
  )
}

export default ShowingRoleListColumnMediums
