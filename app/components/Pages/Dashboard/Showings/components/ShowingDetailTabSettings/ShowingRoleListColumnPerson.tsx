import { Box, Typography } from '@material-ui/core'

import { getShowingRoleLabel } from './helpers'

interface ShowingRoleListColumnPersonProps {
  name: string
  role: IDealRoleType
  phone: string
  email: string
}

function ShowingRoleListColumnPerson({
  name,
  role,
  phone,
  email
}: ShowingRoleListColumnPersonProps) {
  const roleLabel = getShowingRoleLabel(role)

  return (
    <Typography variant="body2" component="div">
      {name}
      {roleLabel && (
        <>
          ,{' '}
          <Box component="span" color="grey.500">
            {roleLabel}
          </Box>
        </>
      )}
      <Box color="grey.500">
        {phone} {phone && email && '.'} {email}
      </Box>
    </Typography>
  )
}

export default ShowingRoleListColumnPerson
