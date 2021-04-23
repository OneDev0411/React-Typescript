import { Box } from '@material-ui/core'

import ShowingDetailTabBookingsListColumnBase from './ShowingDetailTabBookingsListColumnBase'

interface ShowingDetailTabBookingsListColumnPersonProps {
  name: string
  company: Nullable<string>
}

function ShowingDetailTabBookingsListColumnPerson({
  name,
  company
}: ShowingDetailTabBookingsListColumnPersonProps) {
  return (
    <ShowingDetailTabBookingsListColumnBase>
      {name}
      {company && ', '}
      {company && (
        <Box color="grey.500" component="span">
          {company}
        </Box>
      )}
    </ShowingDetailTabBookingsListColumnBase>
  )
}

export default ShowingDetailTabBookingsListColumnPerson
