import React from 'react'

import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    label: { paddingLeft: theme.spacing(2) }
  }),
  {
    name: 'ShowingRoleNotificationTypesMediums'
  }
)

interface ShowingRoleNotificationTypesMediumsProps {
  types: INotificationDeliveryType[]
  onTypesChange: (types: INotificationDeliveryType[]) => void
}

function ShowingRoleNotificationTypesMediums({
  types,
  onTypesChange
}: ShowingRoleNotificationTypesMediumsProps) {
  const classes = useStyles()

  const handleChange = (checked: boolean, type: INotificationDeliveryType) => {
    if (checked) {
      onTypesChange([...types, type])
    } else if (types.length > 1) {
      const newTypes = [...types]
      const index = newTypes.indexOf(type)

      if (index === -1) {
        return
      }

      newTypes.splice(index, 1)
      onTypesChange(newTypes)
    }
  }

  return (
    <Box mx={1.5}>
      <FormGroup>
        <FormControlLabel
          label="Text"
          classes={{ label: classes.label }}
          control={<Checkbox color="primary" />}
          checked={types?.includes('sms')}
          onChange={(e, checked) => handleChange(checked, 'sms')}
        />
        <FormControlLabel
          label="Email"
          classes={{ label: classes.label }}
          control={<Checkbox color="primary" />}
          checked={types?.includes('email')}
          onChange={(e, checked) => handleChange(checked, 'email')}
        />
        <FormControlLabel
          label="Mobile App Notification"
          classes={{ label: classes.label }}
          control={<Checkbox color="primary" />}
          checked={types?.includes('push')}
          onChange={(e, checked) => handleChange(checked, 'push')}
        />
      </FormGroup>
    </Box>
  )
}

export default ShowingRoleNotificationTypesMediums
