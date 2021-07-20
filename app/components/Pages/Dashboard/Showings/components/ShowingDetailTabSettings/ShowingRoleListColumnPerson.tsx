import { Box, Typography } from '@material-ui/core'

import { getShowingRoleLabel } from '../../helpers'

interface ShowingRoleListColumnPersonProps {
  name: string
  role: IDealRoleType
}

function ShowingRoleListColumnPerson({
  name,
  role
}: ShowingRoleListColumnPersonProps) {
  const roleLabel = getShowingRoleLabel(role)

  return (
    <Typography variant="body2" component="div" noWrap>
      {name}
      {roleLabel && <Box color="grey.500">{roleLabel}</Box>}
    </Typography>
  )
}

export default ShowingRoleListColumnPerson
